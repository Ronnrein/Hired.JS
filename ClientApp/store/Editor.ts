import { fetch, addTask } from "domain-task";
import { Action, Reducer, ActionCreator } from "redux";
import { AppThunkAction } from "./";
import { Assignment } from "./AssignmentList";

export interface EditorState {
    assignment: Assignment;
    value: string;
    console: string;
    isLoading: boolean;
    result?: RunResult | VerificationResult;
}

export interface RunResult {
    logs: string[];
    arguments: string[];
    success: boolean;
    error: string;
    result: string;
    correct: string;
}

export interface VerificationResult extends RunResult {
    tests: number;
    completed: number;
    failed?: RunResult;
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
    result: RunResult;
}

export interface RequestScriptVerificationAction {
    type: "REQUEST_SCRIPT_VERIFICATION";
    script: string;
}

export interface ReceiveScriptVerificationAction {
    type: "RECEIVE_SCRIPT_VERIFICATION";
    result: VerificationResult;
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
                arguments: id !== 0 ? args : args[0].replace(/\s/g, "").split(",")
            })
        }).then(response => response.json() as Promise<RunResult>).then(data => {
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
            body: JSON.stringify({
                script: script
            })
        }).then(
            response => response.json() as Promise<VerificationResult>
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
    value: "// Define your function here\nfunction func(args, here) {\n\treturn args + here;\n}",
    assignment: {
        id: 0,
        name: "Free play",
        title: "",
        function: "func",
        summary: "Here you can freely try different things in the editor!",
        template: "",
        messages: [{
            author: {
                id: 0,
                name: "Hired.JS",
                position: "Admin"
            },
            text: ""
        }],
        arguments: [{
            description: "Argument list",
            example: "1, \"Hello there!\""
        }]
    },
    console: "Hired.JS Internal System v2.04\nLoading system...\nLoading complete",
    isLoading: false
}

export const reducer: Reducer<EditorState> = (state: EditorState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    let consoleText: string, message: string;
    switch (action.type) {
        case "LOAD_ASSIGNMENT":
            return Object.assign({}, state, {
                assignment: action.assignment,
                value: action.assignment.template,
                console: `${state.console}\nLoaded assignment ${action.assignment.id}`
            });
        case "REQUEST_SCRIPT_RUN":
        case "REQUEST_SCRIPT_VERIFICATION":
            consoleText = action.type === "REQUEST_SCRIPT_RUN"
                ? `Running assignment ${state.assignment.id} with arguments (${action.arguments.join(", ")})`
                : `Running verification for assignment ${state.assignment.id}`;
            return Object.assign({}, state, {
                isLoading: true,
                console: `${state.console}\n${consoleText}`
            });
        case "RECEIVE_SCRIPT_RUN":
            let logs = action.result.logs.map((l) => {
                return `console.log: ${l}`;
            });
            let log = logs.length !== 0 ? `\n${logs.join("\n")}` : "";
            if(action.result.error != undefined) {
                message = `Error (${action.result.error})`;
            }
            else if(action.result.correct === null) {
                message = `Function output: ${action.result.result}`;
            } else {
                message = `${action.result.success ? "Success!" : "Incorrect"}`;
                message += ` (Expected ${action.result.correct }, got ${action.result.result })`;
            }
            consoleText = `Result: ${message}`;
            return Object.assign({}, state, {
                console: `${state.console+log}\n${consoleText}`,
                isLoading: false,
                result: action.result
            });
        case "RECEIVE_SCRIPT_VERIFICATION":
            if(action.result.failed == undefined) {
                message = `Success! Completed ${action.result.completed} of ${action.result.tests} runs`;
            }
            else if (action.result.failed.error != undefined) {
                message = `Error (${action.result.failed.error})`;
            }
            else {
                let r = action.result.failed;
                message = `Incorrect (Expected ${r.correct}, got ${r.result} with arguments ${r.arguments.join(", ")})`;
            }
            consoleText = `Result: ${message}`;
            return Object.assign({}, state, {
                console: `${state.console}\n${consoleText}`,
                isLoading: false,
                result: action.result
            });
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
