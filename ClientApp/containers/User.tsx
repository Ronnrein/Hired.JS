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
    render() {
        if(this.props.user === undefined) {
            return null;
        }
        return (<UserComponent
            user={this.props.user}
            isLoading={this.props.isLoading}
            onUpdateUsernameClick={(un: string) => this.props.updateUsername(un)}
            onLogoutClick={() => this.props.logout()}
        />);
    }
}

export default connect(
    (state: ApplicationState) => state.user,
    UserStore.actionCreators
)(User);
