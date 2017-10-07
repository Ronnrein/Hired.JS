import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { Script } from "./Scripts";

export interface ThreadsState {
    threads: Thread[];
    selectedThread?: Thread;
    isLoading: boolean;
}

export interface Thread {
    id: number;
    title: string;
    messages: Message[];
    assignment?: Assignment;
}

export interface Assignment {
    id: number;
    name: string;
    function: string;
    summary: string;
    template: string;
    readOnlyLines: number[];
    completed: boolean;
    completedOn?: Date;
    arguments: Argument[];
    scoreSummary?: ScoreSummary;
}

export interface ScoreSummary {
    script: Script;
    scores: number[];
    lowest: number;
    highest: number;
    solutionScore: number;
    labels: string[];
}

export interface Message {
    author: Worker;
    receivedOn: Date;
    text: string;
    image?: string;
}

export interface Argument {
    description: string;
    example: string;
}

export interface Worker {
    id: number;
    name: string;
    position: string;
}

export interface RequestThreadsAction {
    type: "REQUEST_THREADS";
}

export interface ReceiveThreadsAction {
    type: "RECEIVE_THREADS";
    threads: Thread[];
}

export interface SelectThreadAction {
    type: "SELECT_THREAD";
    thread: Thread;
}

type KnownAction = RequestThreadsAction | ReceiveThreadsAction | SelectThreadAction;

export const actionCreators = {
    requestThreads: (): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchThreads = fetch("api/thread", {
            credentials: "same-origin"
        }).then(
            response => response.json() as Promise<Thread[]>
        ).then(data => {

            // Convert date strings to dates
            data.map(thread => thread.messages.map(message => {
                message.receivedOn = new Date(message.receivedOn);
            }));
            dispatch({ type: "RECEIVE_THREADS", threads: data });
        });
        addTask(fetchThreads);
        dispatch({ type: "REQUEST_THREADS" });
    },
    selectThread: (thread: Thread): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if(thread === getState().threads.selectedThread) {
            return;
        }
        dispatch({ type: "SELECT_THREAD", thread: thread });
    }
};

const unloadedState: ThreadsState = {
    threads: [],
    isLoading: false
}

export const reducer: Reducer<ThreadsState> = (state: ThreadsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case "REQUEST_THREADS":
            return {...state, ...{
                isLoading: true
            }};
        case "RECEIVE_THREADS":
            if (action.threads !== state.threads) {
                return {...state, ...{
                    threads: action.threads,
                    isLoading: false
                }};
            }
            break;
        case "SELECT_THREAD":
            return {...state, ...{
                selectedThread: action.thread
            }};
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
};
