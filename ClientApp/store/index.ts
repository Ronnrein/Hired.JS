import * as Editor from "./Editor";
import * as Assignments from "./Assignments";
import * as User from "./User";
import * as App from "./App";

export interface ApplicationState {
    editor: Editor.EditorState;
    assignments: Assignments.AssignmentsState;
    user: User.UserState;
    app: App.AppState;
}

export const reducers = {
    editor: Editor.reducer,
    assignments: Assignments.reducer,
    user: User.reducer,
    app: App.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
