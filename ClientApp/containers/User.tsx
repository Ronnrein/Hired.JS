import * as React from "react";
import * as UserStore from "../store/User";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";

type UserProps =
    UserStore.UserState
    & typeof UserStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class User extends React.Component<UserProps, {}> {
    render() {
        return (<div></div>);
    }
}

export default connect(
    (state: ApplicationState) => state.user,
    UserStore.actionCreators
)(User) as typeof User;
