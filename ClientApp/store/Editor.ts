import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { Assignment } from "./Threads";
import { Script, SaveScriptCompleteAction } from "./Scripts";
import { ConsoleEntryStatus, ConsoleAppendAction } from "./Console";

export interface EditorState {
    assignment: Assignment;
    script: Script;
    isLoading: boolean;
    result?: VerificationResult;
}

export interface RunResult {
    logs: string[];
    arguments: string[];
    success: boolean;
    error: string;
    result: string;
    correct: string;
}

export interface VerificationResult {
    tests: number;
    completed: number;
    failed?: RunResult;
    script?: Script;
}

export interface LoadAssignmentAction {
    type: "LOAD_ASSIGNMENT";
    assignment: Assignment;
    script: Script;
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

type KnownAction = RequestScriptRunAction | ReceiveScriptRunAction | RequestScriptVerificationAction
    | ReceiveScriptVerificationAction | LoadAssignmentAction | ValueChange | SaveScriptCompleteAction
    | ConsoleAppendAction;

export const actionCreators = {
    loadAssignment: (assignment: Assignment, script: Script): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "LOAD_ASSIGNMENT", assignment: assignment, script: script });
    },
    runScript: (args: string[]): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let id = getState().editor.assignment.id;
        let fetchAssignment = fetch(`api/script/run`, {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                script: getState().editor.script,
                arguments: id !== 0 ? args : args[0].replace(/\s/g, "").split(",")
            })
        }).then(response => response.json() as Promise<RunResult>).then(data => {
            dispatch({ type: "RECEIVE_SCRIPT_RUN", result: data });
            let entries = data.logs.map((l) => {
                return {
                    icon: "announcement",
                    status: ConsoleEntryStatus.Log,
                    title: "Console.log",
                    text: l
                };
            });
            if (data.error != undefined) {
                entries.push({
                    icon: "bug",
                    status: ConsoleEntryStatus.Error,
                    title: "Error",
                    text: data.error
                });
            }
            else if (data.correct === null) {
                entries.push({
                    icon: "terminal",
                    status: ConsoleEntryStatus.Success,
                    title: "Output",
                    text: data.result
                });
            } else {
                entries.push({
                    icon: "code",
                    status: data.success ? ConsoleEntryStatus.Success : ConsoleEntryStatus.Error,
                    title: `${data.success ? "Success" : "Incorrect"}`,
                    text: `Expected ${data.correct}, got ${data.result}`
                });
            }
            dispatch({ type: "CONSOLE_APPEND", entries: entries });
        });
        addTask(fetchAssignment);
        dispatch({ type: "CONSOLE_APPEND", entries: [{
            icon: "server",
            status: ConsoleEntryStatus.Info,
            title: "Running",
            text: `Assignment ${getState().editor.assignment.id} with arguments (${args.join(", ")})`
        }]});
        dispatch({ type: "REQUEST_SCRIPT_RUN" });
    },
    verifyScript: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchAssignment = fetch(`api/script/verify`, {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                script: getState().editor.script
            })
        }).then(
            response => response.json() as Promise<VerificationResult>
        ).then(data => {
            dispatch({ type: "RECEIVE_SCRIPT_VERIFICATION", result: data });
            if (data.failed == undefined) {
                dispatch({ type: "CONSOLE_APPEND", entries: [{
                    icon: "checkmark",
                    status: ConsoleEntryStatus.Success,
                    title: "Success",
                    text: `Completed ${data.completed} of ${data.tests} runs`
                }]});
            }
            else if (data.failed.error != undefined) {
                dispatch({ type: "CONSOLE_APPEND", entries: [{
                    icon: "bug",
                    status: ConsoleEntryStatus.Error,
                    title: "Error",
                    text: `${data.failed.error }`
                }]});
            }
            else {
                let r = data.failed;
                dispatch({ type: "CONSOLE_APPEND", entries: [{
                    icon: "code",
                    status: ConsoleEntryStatus.Error,
                    title: "Incorrect",
                    text: `Expected ${r.correct}, got ${r.result} with arguments ${r.arguments.join(", ")}`
                }]});
            }
        });
        addTask(fetchAssignment);
        dispatch({ type: "CONSOLE_APPEND", entries: [{
            icon: "file text",
            status: ConsoleEntryStatus.Info,
            title: "Running verification",
            text: `Assignment ${getState().editor.assignment.id}`
        }]});
        dispatch({ type: "REQUEST_SCRIPT_VERIFICATION" });
    },
    valueChange: (value: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "VALUE_CHANGE", value: value });
    }
};

const unloadedState: EditorState = {
    assignment: {
        id: 0,
        name: "Free play",
        function: "func",
        summary: "Here you can freely try different things in the editor!",
        completed: false,
        completedOn: undefined,
        template: "",
        readOnlyLines: [],
        arguments: [{
            description: "Argument list",
            example: "1, \"Hello there!\""
        }]
    },
    script: {
        id: 0,
        assignmentId: 0,
        name: "Free play",
        text: "// Define your function here\nfunction func(args, here) {\n\treturn args + here;\n}",
        verifiedOn: new Date(),
        isVerified: false,
        modifiedOn: new Date()
    },
    isLoading: false
}

export const reducer: Reducer<EditorState> = (state: EditorState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case "LOAD_ASSIGNMENT":
            return {...state, ...{
                assignment: action.assignment,
                script: action.script
            }};
        case "REQUEST_SCRIPT_RUN":
        case "REQUEST_SCRIPT_VERIFICATION":
            return {...state, ...{
                isLoading: true,
                result: undefined
            }};
        case "RECEIVE_SCRIPT_RUN":
            return {...state, ...{
                isLoading: false
            }};
        case "RECEIVE_SCRIPT_VERIFICATION":
            return { ...state, ...{
                isLoading: false,
                result: action.result,
                script: action.result.script != undefined ? action.result.script : state.script
            }};
        case "VALUE_CHANGE":
            const script = {...state.script};
            script.text = action.value;
            return {...state, ...{
                script: script
            }};
        case "SAVE_SCRIPT_COMPLETE":
            return {...state, ...{
                script: action.script
            }};
        case "CONSOLE_APPEND":
            break;
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
};
