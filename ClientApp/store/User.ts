import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { checkFetchStatus } from "../utils";

export interface UserState {
    user?: User;
    isLoading: boolean;
    isUpdatingUsername: boolean;
    isUpdatingPassword: boolean;
    isInitializing: boolean;
    isPasswordRequired: boolean;
    loadingText?: string;
    message?: string;
}

export interface User {
    userName: string;
    isPasswordEnabled: boolean;
}

export interface RequestUserAction { type: "REQUEST_USER"; loadingText: string; }
export interface RequestLoginAction { type: "REQUEST_LOGIN"; loadingText: string; }
export interface RequestRegisterAction { type: "REQUEST_REGISTER"; loadingText: string; }
export interface RequestUsernameUpdateAction { type: "REQUEST_USERNAME_UPDATE"; }
export interface RequestPasswordUpdateAction { type: "REQUEST_PASSWORD_UPDATE"; }
export interface LogoutAction { type: "LOGOUT"; message: string; }
export interface ReceiveUserSuccessAction { type: "RECEIVE_USER_SUCCESS"; user: User; message?: string; }
export interface UserRequestPasswordRequiredAction { type: "USER_REQUEST_PASSWORD_REQUIRED"; }
export interface UserRequestFailedAction { type: "USER_REQUEST_FAILED"; message?: string; }

type KnownAction = RequestUserAction | ReceiveUserSuccessAction | RequestLoginAction
    | RequestRegisterAction | LogoutAction | RequestUsernameUpdateAction | UserRequestFailedAction
    | RequestPasswordUpdateAction | UserRequestPasswordRequiredAction;

export const actionCreators = {
    fetchUser: (): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchUser = fetch("api/user", {
            credentials: "same-origin",
        }).then(checkFetchStatus).then(
            response => response.json() as Promise<User>
        ).then(data => {
            dispatch({ type: "RECEIVE_USER_SUCCESS", user: data });
        }).catch(e => {
            if(e.response.status === 401) {
                dispatch({ type: "USER_REQUEST_FAILED" });
            }
        });
        addTask(fetchUser);
        dispatch({ type: "REQUEST_USER", loadingText: "Loading..." });
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
            dispatch({ type: "RECEIVE_USER_SUCCESS", user: data });
        }).catch(e => {
            switch(e.response.status) {
                case 404:
                    dispatch({ type: "USER_REQUEST_FAILED", message: "Profile not found!" });
                    break;
                case 403:
                    dispatch({ type: "USER_REQUEST_PASSWORD_REQUIRED" });
                    break;
            }
        });
        addTask(fetchLogin);
        dispatch({ type: "REQUEST_LOGIN", loadingText: "Logging in..." });
    },
    register: (): AppThunkAction<KnownAction> => (dispatch) => {
        let register = fetch("api/user/register", {
            credentials: "same-origin",
            method: "POST"
        }).then(
            response => response.json() as Promise<User>
        ).then(data => {
            dispatch({ type: "RECEIVE_USER_SUCCESS", user: data });
        });
        addTask(register);
        dispatch({ type: "REQUEST_REGISTER", loadingText: "Creating profile..." });
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
            dispatch({ type: "RECEIVE_USER_SUCCESS", user: data, message: "Changed username!" });
        }).catch(e => {
            if (e.response.status === 409) {
                dispatch({ type: "USER_REQUEST_FAILED", message: "Username already exists!" });
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
            dispatch({ type: "RECEIVE_USER_SUCCESS", user: data, message: "Changed password!" });
        }).catch(e => {
            
        });
        addTask(update);
        dispatch({ type: "REQUEST_PASSWORD_UPDATE" });
    },
    logout: (): AppThunkAction<KnownAction> => (dispatch) => {
        fetch("api/user/logout", {
            credentials: "same-origin",
            method: "POST"
        });
        dispatch({ type: "LOGOUT", message: "Successfully logged out" });
    },
}

const unloadedState: UserState = {
    isLoading: false,
    isUpdatingUsername: false,
    isUpdatingPassword: false,
    isPasswordRequired: false,
    isInitializing: true,
    loadingText: "Loading..."
};

export const reducer: Reducer<UserState> = (state: UserState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch(action.type) {
        case "REQUEST_USER":
        case "REQUEST_LOGIN":
        case "REQUEST_REGISTER":
            return {...state, ...{
                isLoading: true,
                loadingText: action.loadingText
            }};
        case "REQUEST_USERNAME_UPDATE":
            return {...state, ...{
                isUpdatingUsername: true
            }};
        case "REQUEST_PASSWORD_UPDATE":
            return {...state, ...{
                isUpdatingPassword: true
            }};
        case "RECEIVE_USER_SUCCESS":
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
                message: "This profile is password protected, please enter password"
            }};
        case "LOGOUT":
            return {...state, ...{
                message: action.message,
                user: undefined
            }};
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}
