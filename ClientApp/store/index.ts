import * as Editor from "./Editor";
import * as Assignments from "./Assignments";
import * as User from "./User";

export interface ApplicationState {
    editor: Editor.EditorState;
    assignments: Assignments.AssignmentsState;
    user: User.UserState;
}

export const reducers = {
    editor: Editor.reducer,
    assignments: Assignments.reducer,
    user: User.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
