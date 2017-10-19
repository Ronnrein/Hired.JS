import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface DocumentationState {
    documentations: Documentation[];
    isLoading: boolean;
}

export interface Documentation {
    title: string;
    text: string;
    url: string;
}

export interface RequestDecoumentationAction {
    type: "REQUEST_DOCUMENTATION";
}

export interface ReceiveDecoumentationAction {
    type: "RECEIVE_DOCUMENTATION";
    documentations: Documentation[];
}

type KnownAction = RequestDecoumentationAction | ReceiveDecoumentationAction;

export const actionCreators = {
    requestDocumentation: (): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchThreads = fetch("api/home/documentation", {
            credentials: "same-origin"
        }).then(
            response => response.json() as Promise<Documentation[]>
        ).then(data => {
            dispatch({ type: "RECEIVE_DOCUMENTATION", documentations: data });
        });
        addTask(fetchThreads);
        dispatch({ type: "REQUEST_DOCUMENTATION" });
    }
}

const unloadedState: DocumentationState = {
    documentations: [],
    isLoading: false
};

export const reducer: Reducer<DocumentationState> = (state: DocumentationState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case "REQUEST_DOCUMENTATION":
            return {...state, ...{
                isLoading: true
            }};
        case "RECEIVE_DOCUMENTATION":
            return {...state, ...{
                isLoading: false,
                documentations: action.documentations
            }};
    default:
        const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}
