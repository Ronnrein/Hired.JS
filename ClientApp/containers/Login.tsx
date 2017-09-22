import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import { connect } from "react-redux";
import { default as LoginComponent } from "../components/Login";
import * as UserStore from "../store/User";

type LoginProps =
    UserStore.UserState
    & typeof UserStore.actionCreators
    & RouteComponentProps<{}>;

class Login extends React.Component<LoginProps, {}> {

    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <LoginComponent
                isLoading={this.props.isLoading}
                onPlayClick={() => this.props.register()}
                onLoginClick={(login: UserStore.LoginFields) => this.props.login(login)}
                message={this.props.message}
            />
        );
    }

}

export default connect(
    (state: ApplicationState) => state.user,
    UserStore.actionCreators
)(Login);
