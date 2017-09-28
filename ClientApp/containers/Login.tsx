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
    state = { message: this.props.message }

    componentWillReceiveProps(next: LoginProps) {
        if (next.message === undefined) {
            return;
        }
        this.setState({ message: next.message });
        this.props.resetMessage();
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <LoginComponent
                isLoading={this.props.isLoading}
                isPasswordRequired={this.props.isPasswordRequired}
                onPlayClick={() => this.props.register()}
                onLoginClick={(un: string, pw: string) => this.props.login(un, pw)}
                message={this.state.message}
            />
        );
    }

}

export default connect(
    (state: ApplicationState) => state.user,
    UserStore.actionCreators
)(Login);
