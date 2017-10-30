import * as React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom"
import { ApplicationState } from "../store";
import * as DocumentationStore from "../store/Documentation";
import * as ThreadStore from "../store/Threads";
import * as ConsoleStore from "../store/Console";
import * as UserStore from "../store/User";
import { actionCreators as threadActions } from "../store/Threads";
import HomeComponent from "../components/home/Home";

type HomeProps = {
    threads: ThreadStore.ThreadsState;
    documentation: DocumentationStore.DocumentationState;
    console: ConsoleStore.ConsoleState;
    user: UserStore.UserState;
    selectAssignment: Function;
};

class Home extends React.Component<HomeProps & RouteComponentProps<{}>, {}> {
    public render() {
        return (
            <HomeComponent
                threads={this.props.threads}
                documentation={this.props.documentation}
                console={this.props.console}
                user={this.props.user}
                selectAssignment={(t: ThreadStore.Thread) => {
                    this.props.selectAssignment(t);
                    this.props.history.push("/threads");
                }}
            />
        );
    }
}

export default withRouter(connect(
    (state: ApplicationState) => ({
        threads: state.threads,
        documentation: state.documentation,
        console: state.console,
        user: state.user
    }), ({
        selectAssignment: threadActions.selectThread
    })
)(Home));
