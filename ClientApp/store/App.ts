import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface AppState {
    notifications: Notification[];
}

export interface Notification {
    title: string;
    message: string;
    icon: string;
}

export enum MessageStatus {
    Success = "success", Info = "info", Error = "error"
}

export interface Message {
    title: string;
    text: string;
    icon: string;
    status: MessageStatus;
}

export interface AddNotificationAction {
    type: "ADD_NOTIFICATION";
    notification: Notification;
}

type KnownAction = AddNotificationAction;

export const actionCreators = {
    addNotification: (title: string, message: string, icon: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "ADD_NOTIFICATION", notification: {
            title: title,
            message: message,
            icon: icon
        }});
    },
}

const unloadedState: AppState = {
    notifications: []
};

export const reducer: Reducer<AppState> = (state: AppState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case "ADD_NOTIFICATION":
            const notifications = { ...state.notifications };
            notifications.push(action.notification);
            return {...state, ...{
                notifications: notifications
            }};
        default:
            // const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}
