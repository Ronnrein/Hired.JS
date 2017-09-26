import { fetch, addTask } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface AssignmentsState {
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
    readOnlyLines: number[];
    completed: boolean;
    completedOn?: string;
    messages: Message[];
    completedMessages: Message[];
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

export interface SelectAssignmentAction {
    type: "SELECT_ASSIGNMENT";
    assignment: Assignment;
}

type KnownAction = RequestAssignmentsAction | ReceiveAssignmentsAction | SelectAssignmentAction;

export const actionCreators = {
    requestAssignments: (): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchAssignments = fetch("api/assignment", {
            credentials: "same-origin"
        }).then(
            response => response.json() as Promise<Assignment[]>
        ).then(data => {
            dispatch({ type: "RECEIVE_ASSIGNMENTS", assignments: data });
        });
        addTask(fetchAssignments);
        dispatch({ type: "REQUEST_ASSIGNMENTS" });
    },
    selectAssignment: (assignment: Assignment): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if(assignment === getState().assignments.selectedAssignment) {
            return;
        }
        dispatch({ type: "SELECT_ASSIGNMENT", assignment: assignment });
    }
};

const unloadedState: AssignmentsState = {
    assignments: [],
    isLoading: false
}

export const reducer: Reducer<AssignmentsState> = (state: AssignmentsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case "REQUEST_ASSIGNMENTS":
            return {...state, ...{
                isLoading: true
            }};
        case "RECEIVE_ASSIGNMENTS":
            if (action.assignments !== state.assignments) {
                return {...state, ...{
                    assignments: action.assignments,
                    isLoading: false
                }};
            }
            break;
        case "SELECT_ASSIGNMENT":
            return {...state, ...{
                selectedAssignment: action.assignment
            }};
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
};
