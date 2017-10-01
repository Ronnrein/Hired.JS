import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface ConsoleState {
    entries: ConsoleEntry[]
}

export enum ConsoleEntryStatus {
    Success = "success", Info = "info", Error = "error", Log = "log"
}

export interface ConsoleEntry {
    title: string;
    text?: string;
    icon: string;
    status: ConsoleEntryStatus;
}

export interface ConsoleAppendAction {
    type: "CONSOLE_APPEND";
    entries: ConsoleEntry[];
}

export interface ConsoleClearAction {
    type: "CONSOLE_CLEAR";
}

type KnownAction = ConsoleAppendAction | ConsoleClearAction;

export const actionCreators = {
    consoleAppend: (entry: ConsoleEntry | ConsoleEntry[]): AppThunkAction<KnownAction> => (dispatch) => {
        const entries = entry instanceof Array ? entry : [entry];
        dispatch({ type: "CONSOLE_APPEND", entries: entries });
    },
    consoleClear: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "CONSOLE_CLEAR" });
    }
};

const unloadedState: ConsoleState = {
    entries: [
        { icon: "power", status: ConsoleEntryStatus.Success, title: "Hired.JS Internal System v2.04" },
        { icon: "hourglass half", status: ConsoleEntryStatus.Info, title: "Loading system..." },
        { icon: "checkmark", status: ConsoleEntryStatus.Success, title: "Loading complete!" }
    ]
}

export const reducer: Reducer<ConsoleState> = (state: ConsoleState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case "CONSOLE_APPEND":
            return {
                ...state, ...{
                    entries: [...state.entries, ...action.entries]
                }
            };
        case "CONSOLE_CLEAR":
            return {
                ...state, ...{
                    entries: []
                }
            };
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
};
