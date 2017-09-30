import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as ThreadsStore from "../store/Threads";
import { default as ThreadsComponent } from "../components/threads/Threads";

type ThreadsProps =
    ThreadsStore.ThreadsState
    & typeof ThreadsStore.actionCreators
    & RouteComponentProps<{}>

class Threads extends React.Component<ThreadsProps, {}> {

    componentDidMount() {
        if(this.props.threads.length === 0) {
            this.props.requestThreads();
        }
    }

    render() {
        return (
            <ThreadsComponent
                threads={this.props.threads}
                selectedThread={this.props.selectedThread}
                isLoading={this.props.isLoading}
                onThreadClick={(a: ThreadsStore.Thread) => this.props.selectThread(a)}
            />
        );
    }

}

export default connect(
    (state: ApplicationState) => state.threads,
    ThreadsStore.actionCreators
)(Threads) as typeof Threads;
