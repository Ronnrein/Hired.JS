import { fetch, addTask } from "domain-task";
import { Action, Reducer, ActionCreator } from "redux";
import { AppThunkAction } from "./";
import { Assignment } from "./Assignments";
import { LoginFields } from "../components/Login";
import { checkFetchStatus } from "../utils";

export interface AppState {
    user?: User;
    assignments?: Assignment[];
    loading: boolean;
    loadingText: string;
    message?: string;
}

export interface User {
    userName: string
}

export interface RequestUserAction {
    type: "REQUEST_USER";
}

export interface ReceiveUserSuccessAction {
    type: "RECEIVE_USER_SUCCESS";
    user: User;
}

export interface ReceiveUserFailedAction {
    type: "RECEIVE_USER_FAILED";
}

export interface RequestLoginAction {
    type: "REQUEST_LOGIN";
}

export interface ReceiveLoginFailedAction {
    type: "RECEIVE_LOGIN_FAILED";
}

export interface RequestRegisterAction {
    type: "REQUEST_REGISTER";
}

export interface LogoutAction {
    type: "LOGOUT";
}

type KnownAction = RequestUserAction | ReceiveUserSuccessAction | ReceiveUserFailedAction
    | RequestLoginAction | ReceiveLoginFailedAction | RequestRegisterAction | LogoutAction;

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
                dispatch({ type: "RECEIVE_USER_FAILED" });
            }
        });
        addTask(fetchUser);
        dispatch({ type: "REQUEST_USER" });
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
                dispatch({ type: "RECEIVE_LOGIN_FAILED" });
            }
        });
        addTask(fetchLogin);
        dispatch({ type: "REQUEST_LOGIN" });
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
        dispatch({ type: "REQUEST_REGISTER" });
    },
    logout: (): AppThunkAction<KnownAction> => (dispatch) => {
        fetch("api/user/logout", {
            credentials: "same-origin",
            method: "POST"
        });
        dispatch({ type: "LOGOUT" });
    },
    test: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        console.log("Loadingtext is: "+getState().app.loadingText);
    }
}

const unloadedState: AppState = {
    loading: true,
    loadingText: "Loading..."
};

export const reducer: Reducer<AppState> = (state: AppState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch(action.type) {
        case "REQUEST_USER":
            return Object.assign({}, state, {
                loading: true,
                loadingText: "Loading..."
            });
        case "RECEIVE_USER_SUCCESS":
            return Object.assign({}, state, {
                loading: false,
                user: action.user,
            });
        case "RECEIVE_USER_FAILED":
            return Object.assign({}, state, {
                loading: false,
            });
        case "REQUEST_LOGIN":
            return Object.assign({}, state, {
                loading: true,
                loadingText: "Logging in..."
            });
        case "RECEIVE_LOGIN_FAILED":
            return Object.assign({}, state, {
                loading: false,
                message: "User profile not found!"
            });
        case "REQUEST_REGISTER":
            return Object.assign({}, state, {
                loading: true,
                loadingText: "Creating profile..."
            });
        case "LOGOUT":
            return Object.assign({}, state, {
                message: "Logged out!",
                user: undefined
            });
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}
