import { fetch, addTask } from "domain-task";
import { Action, Reducer, ActionCreator } from "redux";
import { AppThunkAction } from "./";
import { Assignment } from "./AssignmentList";

export interface EditorState {
    assignment: Assignment;
    result?: ScriptResult;
    value: string;
    console: string;
    isLoading: boolean;
}

export interface RunResult {
    logs: string[];
    arguments: string[];
    success: boolean;
    error: string;
    result: string;
    correct: string;
    time: number;
}

export interface ScriptResult {
    runs: RunResult[];
    success: boolean;
    error: string;
    time: number;
}

export interface LoadAssignmentAction {
    type: "LOAD_ASSIGNMENT";
    assignment: Assignment;
}

export interface RequestScriptRunAction {
    type: "REQUEST_SCRIPT_RUN";
    script: string;
    arguments: string[];
}

export interface ReceiveScriptRunAction {
    type: "RECEIVE_SCRIPT_RUN";
    result: ScriptResult;
}

export interface RequestScriptVerificationAction {
    type: "REQUEST_SCRIPT_VERIFICATION";
    script: string;
}

export interface ReceiveScriptVerificationAction {
    type: "RECEIVE_SCRIPT_VERIFICATION";
    result: ScriptResult;
}

export interface ValueChange {
    type: "VALUE_CHANGE";
    value: string;
}

export interface ConsoleChange {
    type: "CONSOLE_CHANGE";
    value: string;
}

type KnownAction = RequestScriptRunAction | ReceiveScriptRunAction | RequestScriptVerificationAction
                 | ReceiveScriptVerificationAction | LoadAssignmentAction | ValueChange | ConsoleChange; 

export const actionCreators = {
    loadAssignment: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let assignment = getState().assignmentList.assignments.filter(t => t.id === id)[0];
        dispatch({ type: "LOAD_ASSIGNMENT", assignment: assignment });
    },
    runScript: (id: number, script: string, args: string[]): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchAssignment = fetch(`api/assignment/run/${id}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                script: script,
                test: {
                    arguments: args,
                    result: null
                }
            })
        }).then(response => response.json() as Promise<ScriptResult>).then(data => {
            dispatch({ type: "RECEIVE_SCRIPT_RUN", result: data });
        });
        addTask(fetchAssignment);
        dispatch({ type: "REQUEST_SCRIPT_RUN", script: script, arguments: args });
    },
    verifyScript: (id: number, script: string): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchAssignment = fetch(`api/assignment/verify/${id}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ script: script })
        }).then(
            response => response.json() as Promise<ScriptResult>
        ).then(data => {
            dispatch({ type: "RECEIVE_SCRIPT_VERIFICATION", result: data });
        });
        addTask(fetchAssignment);
        dispatch({ type: "REQUEST_SCRIPT_VERIFICATION", script: script });
    },
    valueChange: (value: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "VALUE_CHANGE", value: value });
    },
    addToConsole: (value: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: "CONSOLE_CHANGE", value: getState().editor.console + "\n" + value });
    }
};

const unloadedState: EditorState = {
    value: "",
    assignment: {
        id: 0,
        name: "",
        title: "",
        summary: "",
        template: "",
        messages: []
    },
    console: "Hired.JS Internal System v2.04\nLoading system...\nLoading complete",
    isLoading: false
}

export const reducer: Reducer<EditorState> = (state: EditorState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    let consoleText: string;
    switch (action.type) {
        case "LOAD_ASSIGNMENT":
            return Object.assign({}, state, {
                assignment: action.assignment,
                value: action.assignment.template,
                console: `${state.console}\nLoaded assignment ${action.assignment.id}`
            });
        case "REQUEST_SCRIPT_RUN":
            consoleText = `Running assignment ${state.assignment.id} with arguments (${action.arguments.join(", ")})`;
            return Object.assign({}, state, {
                isLoading: true,
                console: `${state.console}\n${consoleText}`
            });
        case "RECEIVE_SCRIPT_RUN":
            let run = action.result.runs[0];
            let logs = run.logs.map((l) => {
                return `console.log: ${l}`;
            });
            let log = logs.length !== 0 ? `\n${logs.join("\n")}` : "";
            let result = action.result.error != undefined
                ? action.result.error
                : `${run.success ? "Success!" : "Incorrect"} (Expected ${run.correct}, got ${run.result})`;
            consoleText = `Assignment ${state.assignment.id} run result: ${result}`;
            return Object.assign({}, state, {
                result: action.result,
                console: `${state.console+log}\n${consoleText}`,
                isLoading: false
            });
        case "REQUEST_SCRIPT_VERIFICATION":
            break;
        case "RECEIVE_SCRIPT_VERIFICATION":
            break;
        case "VALUE_CHANGE":
            return Object.assign({}, state, {
                value: action.value
            });
        case "CONSOLE_CHANGE":
            return Object.assign({}, state, {
                console: action.value
            });
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
};