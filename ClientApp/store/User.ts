import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { checkFetchStatus } from "../utils";
import { Message, MessageStatus } from "./App";

export interface UserState {
    user?: User;
    isLoading: boolean;
    isUpdatingUsername: boolean;
    isUpdatingPassword: boolean;
    isInitializing: boolean;
    isPasswordRequired: boolean;
    loadingText?: string;
    message?: Message;
}

export interface User {
    userName: string;
    isPasswordEnabled: boolean;
}

export interface RequestUserAction { type: "REQUEST_USER"; }
export interface RequestUsernameUpdateAction { type: "REQUEST_USERNAME_UPDATE"; }
export interface RequestPasswordUpdateAction { type: "REQUEST_PASSWORD_UPDATE"; }
export interface LogoutCompleteAction { type: "LOGOUT_COMPLETE"; }
export interface LogoutAction { type: "LOGOUT"; }
export interface ReceiveUserAction { type: "RECEIVE_USER"; user: User; message?: Message; }
export interface UserRequestPasswordRequiredAction { type: "USER_REQUEST_PASSWORD_REQUIRED"; }
export interface UserRequestFailedAction { type: "USER_REQUEST_FAILED"; message?: Message; }
export interface ResetMessageAction { type: "RESET_MESSAGE"; }

type KnownAction = RequestUserAction | ReceiveUserAction | LogoutAction
    | RequestUsernameUpdateAction | UserRequestFailedAction | RequestPasswordUpdateAction
    | UserRequestPasswordRequiredAction | ResetMessageAction | LogoutCompleteAction;

export const actionCreators = {
    fetchUser: (): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchUser = fetch("api/user", {
            credentials: "same-origin",
        }).then(checkFetchStatus).then(
            response => response.json() as Promise<User>
        ).then(data => {
            dispatch({ type: "RECEIVE_USER", user: data });
        }).catch(e => {
            if(e.response.status === 401) {
                dispatch({ type: "USER_REQUEST_FAILED" });
            }
        });
        addTask(fetchUser);
        dispatch({ type: "REQUEST_USER" });
    },
    login: (userName: string, password: string): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchLogin = fetch("api/user/login", {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: userName,
                password: password
            })
        }).then(checkFetchStatus).then(
            response => response.json() as Promise<User>
        ).then(data => {
            dispatch({ type: "RECEIVE_USER", user: data });
        }).catch(e => {
            switch(e.response.status) {
                case 404:
                    dispatch({ type: "USER_REQUEST_FAILED", message: {
                        title: "Not found",
                        text: "This profile was not found",
                        icon: "user",
                        status: MessageStatus.Error
                    }});
                    break;
                case 401:
                    dispatch({ type: "USER_REQUEST_FAILED", message: {
                        title: "Wrong password",
                        text: "Password is incorrect",
                        icon: "key",
                        status: MessageStatus.Error
                    }});
                    break;
                case 403:
                    dispatch({ type: "USER_REQUEST_PASSWORD_REQUIRED" });
                    break;
            }
        });
        addTask(fetchLogin);
        dispatch({ type: "REQUEST_USER" });
    },
    register: (): AppThunkAction<KnownAction> => (dispatch) => {
        let register = fetch("api/user/register", {
            credentials: "same-origin",
            method: "POST"
        }).then(
            response => response.json() as Promise<User>
        ).then(data => {
            dispatch({ type: "RECEIVE_USER", user: data });
        });
        addTask(register);
        dispatch({ type: "REQUEST_USER" });
    },
    updateUsername: (userName: string): AppThunkAction<KnownAction> => (dispatch) => {
        let update = fetch("api/user/updateUserName", {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: userName
            })
        }).then(checkFetchStatus).then(
            response => response.json() as Promise<User>
        ).then(data => {
            dispatch({ type: "RECEIVE_USER", user: data, message: {
                title: "Updated",
                text: "Username has been updated",
                icon: "tag",
                status: MessageStatus.Success
            }});
        }).catch(e => {
            if (e.response.status === 409) {
                dispatch({ type: "USER_REQUEST_FAILED", message: {
                    title: "Already exists",
                    text: "This username has already been taken",
                    icon: "tag",
                    status: MessageStatus.Error
                }});
            }
        });
        addTask(update);
        dispatch({ type: "REQUEST_USERNAME_UPDATE" });
    },
    updatePassword: (password: string): AppThunkAction<KnownAction> => (dispatch) => {
        let update = fetch("api/user/updatePassword", {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password
            })
        }).then(checkFetchStatus).then(
            response => response.json() as Promise<User>
        ).then(data => {
            dispatch({ type: "RECEIVE_USER", user: data, message: {
                title: "Updated",
                text: "Your password was updated",
                icon: "key",
                status: MessageStatus.Success
            }});
        }).catch(e => {
            
        });
        addTask(update);
        dispatch({ type: "REQUEST_PASSWORD_UPDATE" });
    },
    logout: (): AppThunkAction<KnownAction> => (dispatch) => {
        fetch("api/user/logout", {
            credentials: "same-origin",
            method: "POST"
        }).then(() => {
            dispatch({ type: "LOGOUT_COMPLETE" });
        });
        dispatch({ type: "LOGOUT" });
    },
    resetMessage: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "RESET_MESSAGE" });
    }
}

const unloadedState: UserState = {
    isLoading: false,
    isUpdatingUsername: false,
    isUpdatingPassword: false,
    isPasswordRequired: false,
    isInitializing: true
};

export const reducer: Reducer<UserState> = (state: UserState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch(action.type) {
        case "REQUEST_USER":
            return {...state, ...{
                isLoading: true
            }};
        case "REQUEST_USERNAME_UPDATE":
            return {...state, ...{
                isUpdatingUsername: true
            }};
        case "REQUEST_PASSWORD_UPDATE":
            return {...state, ...{
                isUpdatingPassword: true
            }};
        case "RECEIVE_USER":
            return {...state, ...{
                isLoading: false,
                isUpdatingUsername: false,
                isUpdatingPassword: false,
                isInitializing: false,
                user: action.user,
                message: action.message
            }};
        case "USER_REQUEST_FAILED":
            return {...state, ...{
                isLoading: false,
                isUpdatingUsername: false,
                isUpdatingPassword: false,
                isInitializing: false,
                message: action.message
            }};
        case "USER_REQUEST_PASSWORD_REQUIRED":
            return {...state, ...{
                isLoading: false,
                isPasswordRequired: true,
                message: {
                    title: "Protected",
                    text: "This profile is password protected, please enter your password",
                    icon: "key",
                    status: MessageStatus.Info
                }
            }};
        case "LOGOUT":
            return {...state, ...{
                isLoading: true
            }};
        case "LOGOUT_COMPLETE":
            return {...state, ...{
                user: undefined,
                isLoading: false,
                message: {
                    title: "Logged out",
                    text: "You were successfully logged out",
                    icon: "lock",
                    status: MessageStatus.Success
                }
            }};
        case "RESET_MESSAGE":
            return {...state, ...{
                message: undefined
            }};
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}
