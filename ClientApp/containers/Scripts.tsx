import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import { connect } from "react-redux";
import { actionCreators as editorActions } from "../store/Editor";
import * as ThreadsStore from "../store/Threads";
import * as ScriptsStore from "../store/Scripts";
import ScriptSelector from "../components/scripts/ScriptSelector";

type ImportedProps = {
    selectedThread: ThreadsStore.Thread;
    loadAssignment: Function;
}

type ScriptsProps =
    ScriptsStore.ScriptsState
    & typeof ScriptsStore.actionCreators
    & ImportedProps
    & RouteComponentProps<{}>;

class Scripts extends React.Component<ScriptsProps, {}> {

    onLoadAssignmentClick() {
        this.props.loadAssignment(this.props.selectedThread.assignment, this.props.selectedScript);
    }

    render() {
        if(!this.props.selectedThread || !this.props.selectedThread.assignment) {
            return null;
        }
        return (
            <ScriptSelector
                assignment={this.props.selectedThread.assignment}
                scripts={this.props.scripts}
                selectedScript={this.props.selectedScript}
                isLoading={this.props.isLoading}
                isSaving={this.props.isSaving}
                onLoadAssignmentClick={() => this.onLoadAssignmentClick()}
                onCreateClick={(n: string) => this.props.createScript(n, this.props.selectedThread.id)}
                onDeleteClick={(s: ScriptsStore.Script) => this.props.deleteScript(s)}
                onModalOpen={() => this.props.requestScripts()}
                onSelectScript={(s: ScriptsStore.Script) => this.props.selectScript(s)}
            />
        );
    }

}

export default connect(
    (state: ApplicationState) => ({...state.scripts, ...{
        selectedThread: state.threads.selectedThread,
    }}),
    ({...ScriptsStore.actionCreators, ...{
        loadAssignment: editorActions.loadAssignment
    }})
)(Scripts);
