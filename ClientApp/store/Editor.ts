import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { Assignment } from "./Assignments";

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
}

export interface ReceiveScriptRunAction {
    type: "RECEIVE_SCRIPT_RUN";
    result: RunResult;
}

export interface RequestScriptVerificationAction {
    type: "REQUEST_SCRIPT_VERIFICATION";
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
    loadAssignment: (assignment: Assignment): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: "LOAD_ASSIGNMENT", assignment: assignment });
    },
    runScript: (args: string[]): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let id = getState().editor.assignment.id;
        let fetchAssignment = fetch(`api/assignment/run/${id}`, {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                script: getState().editor.value,
                arguments: id !== 0 ? args : args[0].replace(/\s/g, "").split(",")
            })
        }).then(response => response.json() as Promise<RunResult>).then(data => {
            dispatch({ type: "RECEIVE_SCRIPT_RUN", result: data });
            let message: string;
            let logs = data.logs.map((l) => {
                return `console.log: ${l}`;
            });
            let log = logs.length !== 0 ? `\n${logs.join("\n")}\n` : "\n";
            if (data.error != undefined) {
                message = `Error (${data.error})`;
            }
            else if (data.correct === null) {
                message = `Function output: ${data.result}`;
            } else {
                message = `${data.success ? "Success!" : "Incorrect"}`;
                message += ` (Expected ${data.correct}, got ${data.result})`;
            }
            dispatch({
                type: "CONSOLE_CHANGE",
                value: `${getState().editor.console}${log}Result: ${message}`
            });
        });
        addTask(fetchAssignment);
        let console = `Running assignment ${getState().editor.assignment.id} with arguments (${args.join(", ")})`;
        dispatch({
            type: "CONSOLE_CHANGE",
            value: `${getState().editor.console}\n${console}`
        });
        dispatch({ type: "REQUEST_SCRIPT_RUN" });
    },
    verifyScript: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let id = getState().editor.assignment.id;
        let fetchAssignment = fetch(`api/assignment/verify/${id}`, {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                script: getState().editor.value
            })
        }).then(
            response => response.json() as Promise<VerificationResult>
        ).then(data => {
            dispatch({ type: "RECEIVE_SCRIPT_VERIFICATION", result: data });
            let message: string;
            if (data.failed == undefined) {
                message = `Success! Completed ${data.completed} of ${data.tests} runs`;
            }
            else if (data.failed.error != undefined) {
                message = `Error (${data.failed.error})`;
            }
            else {
                let r = data.failed;
                message = `Incorrect (Expected ${r.correct}, got ${r.result} with arguments ${r.arguments.join(", ")})`;
            }
            dispatch({
                type: "CONSOLE_CHANGE",
                value: `${getState().editor.console}\n"Result: ${message}`
            });
        });
        addTask(fetchAssignment);
        let console = `Running verification for assignment ${getState().editor.assignment.id}`;
        dispatch({
            type: "CONSOLE_CHANGE",
            value: `${getState().editor.console}\n${console}`
        });
        dispatch({ type: "REQUEST_SCRIPT_VERIFICATION" });
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
        readOnlyLines: [],
        messages: [{
            author: {
                id: 0,
                name: "Hired.JS",
                position: "Admin"
            },
            text: ""
        }],
        completedMessages: [],
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
    switch (action.type) {
        case "LOAD_ASSIGNMENT":
            return Object.assign({}, state, {
                assignment: action.assignment,
                value: action.assignment.template,
                console: `${state.console}\nLoaded assignment ${action.assignment.id}`
            });
        case "REQUEST_SCRIPT_RUN":
        case "REQUEST_SCRIPT_VERIFICATION":
            return Object.assign({}, state, {
                isLoading: true
            });
        case "RECEIVE_SCRIPT_RUN":
            return Object.assign({}, state, {
                isLoading: false,
                result: action.result
            });
        case "RECEIVE_SCRIPT_VERIFICATION":
            return Object.assign({}, state, {
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
