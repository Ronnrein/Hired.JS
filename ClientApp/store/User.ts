import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { checkFetchStatus } from "../utils";

export interface UserState {
    user?: User;
    isLoading: boolean;
    isInitializing: boolean;
    loadingText?: string;
    message?: string;
}

export interface User {
    userName: string
}

export interface LoginFields {
    userName: string;
}

export interface RequestUserAction {
    type: "REQUEST_USER";
    loadingText: string;
}

export interface RequestLoginAction {
    type: "REQUEST_LOGIN";
    loadingText: string;
}

export interface RequestRegisterAction {
    type: "REQUEST_REGISTER";
    loadingText: string;
}

export interface RequestUsernameUpdateAction {
    type: "REQUEST_USERNAME_UPDATE";
}

export interface LogoutAction {
    type: "LOGOUT";
    message: string;
}

export interface ReceiveUserSuccessAction {
    type: "RECEIVE_USER_SUCCESS";
    user: User;
    message?: string;
}

export interface UserRequestFailedAction {
    type: "USER_REQUEST_FAILED";
    message?: string;
}

type KnownAction = RequestUserAction | ReceiveUserSuccessAction | RequestLoginAction
    | RequestRegisterAction | LogoutAction | RequestUsernameUpdateAction | UserRequestFailedAction;

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
    login: (login: LoginFields): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchLogin = fetch("api/user/login", {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: login.userName
            })
        }).then(checkFetchStatus).then(
            response => response.json() as Promise<User>
        ).then(data => {
            dispatch({ type: "RECEIVE_USER_SUCCESS", user: data });
        }).catch(e => {
            if (e.response.status === 404) {
                dispatch({ type: "USER_REQUEST_FAILED", message: "Profile not found!" });
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
    isInitializing: true,
    loadingText: "Loading..."
};

export const reducer: Reducer<UserState> = (state: UserState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch(action.type) {
        case "REQUEST_USER":
        case "REQUEST_LOGIN":
        case "REQUEST_REGISTER":
            return Object.assign({}, state, {
                isLoading: true,
                loadingText: action.loadingText
            });
        case "REQUEST_USERNAME_UPDATE":
            return Object.assign({}, state, {
                isLoading: true
            });
        case "RECEIVE_USER_SUCCESS":
            return Object.assign({}, state, {
                isLoading: false,
                isInitializing: false,
                user: action.user,
                message: action.message
            });
        case "USER_REQUEST_FAILED":
            return Object.assign({}, state, {
                isLoading: false,
                isInitializing: false,
                message: action.message
            });
        case "LOGOUT":
            return Object.assign({}, state, {
                message: action.message,
                user: undefined
            });
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}
