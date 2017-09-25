import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import { connect } from "react-redux";
import { actionCreators as editorActions } from "../store/Editor";
import * as AssignmentsStore from "../store/Assignments";
import * as ScriptsStore from "../store/Scripts";
import ScriptSelector from "../components/scripts/ScriptSelector";

type ImportedProps = {
    selectedAssignment: AssignmentsStore.Assignment;
    loadAssignment: Function;
}

type ScriptsProps =
    ScriptsStore.ScriptsState
    & typeof ScriptsStore.actionCreators
    & ImportedProps
    & RouteComponentProps<{}>;

class Scripts extends React.Component<ScriptsProps, {}> {

    onLoadAssignmentClick() {
        this.props.loadAssignment(this.props.selectedAssignment, this.props.selectedScript);
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
                onLoadAssignmentClick={() => this.onLoadAssignmentClick()}
                onCreateClick={(n: string) => this.props.createScript(n, this.props.selectedAssignment.id)}
                onDeleteClick={(s: ScriptsStore.Script) => this.props.deleteScript(s)}
                onModalOpen={() => this.props.requestScripts()}
                onSelectScript={(s: ScriptsStore.Script) => this.props.selectScript(s)}
            />
        );
    }

}

export default connect(
    (state: ApplicationState) => ({...state.scripts, ...{
        selectedAssignment: state.assignments.selectedAssignment,
    }}),
    ({...ScriptsStore.actionCreators, ...{
        loadAssignment: editorActions.loadAssignment
    }})
)(Scripts);
