import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as ConsoleStore from "../store/Console";
import { default as ConsoleComponent } from "../components/console/Console";

type ConsoleProps =
    ConsoleStore.ConsoleState
    & typeof ConsoleStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class Console extends React.Component<ConsoleProps, {}> {
    public render() {
        return (
            <ConsoleComponent entries={this.props.entries} />
        );
    }
}

export default connect(
    (state: ApplicationState) => state.console,
    ConsoleStore.actionCreators
)(Console);
