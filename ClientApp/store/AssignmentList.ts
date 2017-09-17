import { fetch, addTask } from "domain-task";
import { Action, Reducer, ActionCreator } from "redux";
import { AppThunkAction } from "./";

export interface AssignmentListState {
    assignments: Assignment[];
    selectedAssignment?: Assignment;
    isLoading: boolean;
}

export interface Assignment {
    id: number;
    name: string;
    title: string;
    function: string;
    summary: string;
    template: string;
    messages: Message[];
    arguments: Argument[];
}

export interface Message {
    author: Worker;
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

export interface RequestAssignmentsAction {
    type: "REQUEST_ASSIGNMENTS";
}

export interface ReceiveAssignmentsAction {
    type: "RECEIVE_ASSIGNMENTS";
    assignments: Assignment[];
}

export interface SelectAssignment {
    type: "SELECT_ASSIGNMENT";
    assignment: Assignment;
}

type KnownAction = RequestAssignmentsAction | ReceiveAssignmentsAction | SelectAssignment;

export const actionCreators = {
    requestAssignments: (): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchAssignments = fetch("api/assignment").then(
            response => response.json() as Promise<Assignment[]>
        ).then(data => {
            dispatch({ type: "RECEIVE_ASSIGNMENTS", assignments: data });
        });
        addTask(fetchAssignments);
        dispatch({ type: "REQUEST_ASSIGNMENTS" });
    },
    selectAssignment: (assignment: Assignment): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "SELECT_ASSIGNMENT", assignment: assignment });
    }
};

const unloadedState: AssignmentListState = {
    assignments: [],
    isLoading: false
}

export const reducer: Reducer<AssignmentListState> = (state: AssignmentListState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case "REQUEST_ASSIGNMENTS":
            return Object.assign({}, state, {
                isLoading: true
            });
        case "RECEIVE_ASSIGNMENTS":
            if (action.assignments !== state.assignments) {
                return Object.assign({}, state, {
                    assignments: action.assignments,
                    isLoading: false
                });
            }
            break;
        case "SELECT_ASSIGNMENT":
            return Object.assign({}, state, {
                selectedAssignment: action.assignment
            });
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
};
