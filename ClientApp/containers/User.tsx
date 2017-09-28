import * as React from "react";
import * as UserStore from "../store/User";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import { default as UserComponent } from "../components/User";

type UserProps =
    UserStore.UserState
    & typeof UserStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class User extends React.Component<UserProps, {}> {
    state = {message: this.props.message}

    componentWillReceiveProps(next: UserProps) {
        if(next.message === undefined) {
            return;
        }
        this.setState({message: next.message});
        this.props.resetMessage();
    }

    render() {
        if(this.props.user === undefined) {
            return null;
        }
        return (<UserComponent
            user={this.props.user}
            message={this.state.message}
            isLoading={this.props.isLoading}
            isUpdatingUsername={this.props.isUpdatingUsername}
            isUpdatingPassword={this.props.isUpdatingPassword}
            onUpdateUsernameClick={(un: string) => this.props.updateUsername(un)}
            onUpdatePasswordClick={(pw: string) => this.props.updatePassword(pw)}
            onLogoutClick={() => this.props.logout()}
        />);
    }
}

export default connect(
    (state: ApplicationState) => state.user,
    UserStore.actionCreators
)(User);
