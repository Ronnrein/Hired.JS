import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import { connect } from "react-redux";
import { Assignment } from "../store/Assignments";
import { actionCreators as editorActions } from "../store/Editor";
import * as AssignmentsStore from "../store/Assignments";
import * as ScriptsStore from "../store/Scripts";
import ScriptSelector from "../components/scripts/ScriptSelector";

type ImportedProps = {
    selectedScript: ScriptsStore.Script;
    selectedAssignment: AssignmentsStore.Assignment;
    loadAssignment: Function;
}

type ScriptsProps =
    ScriptsStore.ScriptsState
    & typeof ScriptsStore.actionCreators
    & ImportedProps
    & RouteComponentProps<{}>;

class Scripts extends React.Component<ScriptsProps, {}> {

    onLoadAssignmentClick(a: AssignmentsStore.Assignment) {
        this.props.loadAssignment(a);
        this.props.history.push("/editor");
    }

    render() {
        if(this.props.selectedAssignment === undefined) {
            return null;
        }
        return (
            <ScriptSelector
                assignment={this.props.selectedAssignment}
                scripts={this.props.scripts}
                selectedScript={this.props.selectedScript}
                isLoading={this.props.isLoading}
                isSaving={this.props.isSaving}
                onLoadAssignmentClick={(a: Assignment) => this.onLoadAssignmentClick(a)}
                onCreateClick={(n: string) => this.props.createScript(n, this.props.selectedAssignment.id)}
                onDeleteClick={(s: ScriptsStore.Script) => this.props.deleteScript(s)}
                onModalOpen={() => this.props.requestScripts()}
                onSelectScript={(s: ScriptsStore.Script) => this.props.selectScript(s)}
            />
        );
    }

}

export default connect(
    (state: ApplicationState) => ({
        scripts: state.scripts.scripts,
        selectedScript: state.scripts.selectedScript,
        isLoading: state.scripts.isLoading,
        isSaving: state.scripts.isSaving,
        selectedAssignment: state.assignments.selectedAssignment
    }),
    Object.assign(ScriptsStore.actionCreators, {
        loadAssignment: editorActions.loadAssignment
    })
)(Scripts);
