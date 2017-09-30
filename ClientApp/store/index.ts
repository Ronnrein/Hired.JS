import * as Editor from "./Editor";
import * as Threads from "./Threads";
import * as User from "./User";
import * as App from "./App";
import * as Scripts from "./Scripts";

export interface ApplicationState {
    editor: Editor.EditorState;
    threads: Threads.ThreadsState;
    user: User.UserState;
    app: App.AppState;
    scripts: Scripts.ScriptsState;
}

export const reducers = {
    editor: Editor.reducer,
    threads: Threads.reducer,
    user: User.reducer,
    app: App.reducer,
    scripts: Scripts.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
