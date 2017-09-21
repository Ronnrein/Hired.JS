import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import { connect } from "react-redux";
import { Dimmer, Loader } from "semantic-ui-react";
import Login, { LoginFields } from "../components/Login";
import Layout from "../components/Layout";
import * as UserStore from "../store/User";
import { actionCreators as assignmentsActions } from "../store/Assignments";

type ImportedProps = {
    requestAssignments: Function;
}

type AppProps =
    UserStore.UserState
    & typeof UserStore.actionCreators
    & ImportedProps
    & RouteComponentProps<{}>;

class App extends React.Component<AppProps, {}> {

    componentDidMount() {
        this.props.fetchUser();
    }

    componentWillReceiveProps(next: AppProps) {
        if(this.props.user === undefined && next.user !== undefined) {
            this.props.requestAssignments();
        }
    }

    onPlayClick() {
        this.props.register();
    }

    onLoginClick(login: LoginFields) {
        this.props.login(login);
    }

    render() {
        return (
            <div>
                <Dimmer active={this.props.loading}>
                    <Loader size="big">{this.props.loadingText}</Loader>
                </Dimmer>
                {this.props.user === undefined ? (
                    <Login
                        onPlayClick={() => this.onPlayClick()}
                        onLoginClick={(login: LoginFields) => this.onLoginClick(login)}
                        message={this.props.message}
                    />
                ) : (
                    <Layout user={this.props.user} />
                )}
            </div>
        );
    }

}

export default connect(
    (state: ApplicationState) => state.user,
    Object.assign(UserStore.actionCreators, { requestAssignments: assignmentsActions.requestAssignments })
)(App) as typeof App;
