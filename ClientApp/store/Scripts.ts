import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface ScriptsState {
    scripts: Script[];
    selectedScript?: Script;
    isLoading: boolean;
    isSaving: boolean;
}

export interface Script {
    id: number;
    assignmentId: number;
    name: string;
    text: string;
    verifiedOn: string;
    isVerified: boolean;
    modifiedOn: string;
}

export interface RequestScriptsAction {
    type: "REQUEST_SCRIPTS";
}

export interface ReceiveScriptsAction {
    type: "RECEIVE_SCRIPTS";
    scripts: Script[];
}

export interface SaveScriptAction {
    type: "SAVE_SCRIPT";
}

export interface SaveScriptCompleteAction {
    type: "SAVE_SCRIPT_COMPLETE";
    script: Script;
}

export interface DeleteScriptAction {
    type: "DELETE_SCRIPT";
    script: Script;
}

export interface SelectScriptAction {
    type: "SELECT_SCRIPT";
    script: Script;
}

type KnownAction = RequestScriptsAction | ReceiveScriptsAction | SaveScriptAction
    | SaveScriptCompleteAction | DeleteScriptAction | SelectScriptAction;

export const actionCreators = {
    requestScripts: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const t = getState().threads.selectedThread;
        if(!t || !t.assignment) {
            return;
        }
        const fetchScripts = fetch(`api/script/assignment/${t.assignment.id}`, {
            credentials: "same-origin" 
        }).then(
            response => response.json() as Promise<Script[]>
        ).then(data => {
            dispatch({ type: "RECEIVE_SCRIPTS", scripts: data });
        });
        addTask(fetchScripts);
        dispatch({ type: "REQUEST_SCRIPTS" });
    },
    createScript: (name: string, assignmentId: number): AppThunkAction<KnownAction> => (dispatch) => {
        const saveScript = fetch("api/script/create", {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name, assignmentId: assignmentId
            })
        }).then(
            response => response.json() as Promise<Script>
        ).then(data => {
            dispatch({ type: "SAVE_SCRIPT_COMPLETE", script: data });
        });
        addTask(saveScript);
        dispatch({ type: "SAVE_SCRIPT" });
    },
    saveScript: (script: Script): AppThunkAction<KnownAction> => (dispatch) => {
        const saveScript = fetch(`api/script/save/${script.id}`, {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(script)
        }).then(
            response => response.json() as Promise<Script>
        ).then(data => {
            dispatch({ type: "SAVE_SCRIPT_COMPLETE", script: data });
        });
        addTask(saveScript);
        dispatch({ type: "SAVE_SCRIPT" });
    },
    deleteScript: (script: Script): AppThunkAction<KnownAction> => (dispatch) => {
        const deleteScript = fetch(`api/script/delete/${script.id}`, {
            credentials: "same-origin",
            method: "POST"
        });
        addTask(deleteScript);
        console.log("DISPATCH");
        dispatch({ type: "DELETE_SCRIPT", script: script });
    },
    selectScript: (script: Script): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if(script === getState().scripts.selectedScript) {
            return;
        }
        dispatch({ type: "SELECT_SCRIPT", script: script });
    }
};

const unloadedState: ScriptsState = {
    scripts: [],
    isLoading: false,
    isSaving: false
}

export const reducer: Reducer<ScriptsState> = (state: ScriptsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    let scripts: any, script: any;
    switch (action.type) {
        case "REQUEST_SCRIPTS":
            return {...state, ...{
                isLoading: true,
                scripts: []
            }};
        case "RECEIVE_SCRIPTS":
            return {...state, ...{
                scripts: action.scripts,
                isLoading: false,
                isSaving: false,
                selectedScript: action.scripts[0]
            }};
        case "SAVE_SCRIPT":
            return {...state, ...{
                isSaving: true
            }};
        case "SAVE_SCRIPT_COMPLETE":
            scripts = state.scripts.slice();
            script = scripts.find((s: Script) => s.id === action.script.id);
            if (script != undefined) {
                scripts[scripts.indexOf(script, 0)] = script;
            } else {
                scripts.push(action.script);
            }
            return {...state, ...{
                isSaving: false,
                scripts: scripts,
                selectedScript: action.script
            }};
        case "DELETE_SCRIPT":
            scripts = state.scripts.slice();
            scripts.splice(state.scripts.indexOf(action.script), 1);
            return {...state, ...{
                scripts: scripts,
                selectedScript: state.selectedScript === action.script ? undefined : state.selectedScript 
            }};
        case "SELECT_SCRIPT":
            return {...state, ...{
                selectedScript: action.script
            }};
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
};
