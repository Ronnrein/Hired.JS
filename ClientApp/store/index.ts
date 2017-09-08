import * as Editor from "./Editor";
import * as AssignmentList from "./AssignmentList";

export interface ApplicationState {
    editor: Editor.EditorState;
    assignmentList: AssignmentList.AssignmentListState;
}

export const reducers = {
    editor: Editor.reducer,
    assignmentList: AssignmentList.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
