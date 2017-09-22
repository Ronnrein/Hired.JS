import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import { connect } from "react-redux";
import { Dimmer, Loader } from "semantic-ui-react";
import Login from "../containers/Login";
import Layout from "../components/Layout";
import * as UserStore from "../store/User";
import * as AppStore from "../store/App";
import { actionCreators as assignmentsActions } from "../store/Assignments";

type ImportedProps = {
    requestAssignments: Function;
    user: UserStore.User;
    isInitializing: boolean;
}

type AppProps =
    AppStore.AppState
    & typeof AppStore.actionCreators
    & ImportedProps
    & RouteComponentProps<{}>;

class App extends React.Component<AppProps, {}> {

    // Load assignments once user is logged in
    componentWillReceiveProps(next: AppProps) {
        if (this.props.user === undefined && next.user !== undefined) {
            this.props.requestAssignments();
        }
    }

    render() {
        return (
            <div>
                <Dimmer active={this.props.isInitializing}>
                    <Loader size="big">Loading...</Loader>
                </Dimmer>
                {this.props.user === undefined ? (
                    <Login />
                ) : (
                    <Layout currentPath={this.props.location.pathname} />
                )}
            </div>
        );
    }

}

export default connect(
    (state: ApplicationState) => ({
        user: state.user.user,
        isInitializing: state.user.isInitializing,
        notifications: state.app.notifications
    }),
    Object.assign(UserStore.actionCreators, {
        requestAssignments: assignmentsActions.requestAssignments
    })
)(App) as typeof App;
