import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import { connect } from "react-redux";
import { Dimmer, Loader, Image } from "semantic-ui-react";
import Login from "../containers/Login";
import Layout from "../components/Layout";
import * as UserStore from "../store/User";
import * as AppStore from "../store/App";
import { actionCreators as threadsActions } from "../store/Threads";

type ImportedProps = {
    requestThreads: Function;
    user: UserStore.User;
    isInitializing: boolean;
}

type AppProps =
    AppStore.AppState
    & typeof AppStore.actionCreators
    & ImportedProps
    & RouteComponentProps<{}>;

class App extends React.Component<AppProps, {}> {

    // Load threads once user is logged in
    componentWillReceiveProps(next: AppProps) {
        if (!this.props.user && next.user) {
            this.props.requestThreads();
        }
    }

    render() {
        return (
            <div>
                <Dimmer active={this.props.isInitializing} className="splash">
                    <Image src="/images/splash.png" centered />
                    <Loader size="big">Loading...</Loader>
                </Dimmer>
                {!this.props.user ? (
                    <Login />
                ) : (
                    <Layout currentPath={this.props.location.pathname} />
                )}
            </div>
        );
    }

}

export default connect(
    (state: ApplicationState) => ({...state.app, ...{
        user: state.user.user,
        isInitializing: state.user.isInitializing,
    }}),
    ({...AppStore.actionCreators, ...{
        requestThreads: threadsActions.requestThreads
    }})
)(App) as typeof App;
