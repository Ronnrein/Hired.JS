import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as AssignmentsStore from "../store/Assignments";
import { actionCreators as editorActions } from "../store/Editor";
import AssignmentList from "../components/assignments/AssignmentList";

type AssignmentsProps =
    AssignmentsStore.AssignmentsState
    & typeof AssignmentsStore.actionCreators
    & RouteComponentProps<{}>

class Assignments extends React.Component<AssignmentsProps, {}> {

    componentDidMount() {
        if(this.props.assignments.length === 0) {
            this.props.requestAssignments();
        }
    }

    render() {
        return (
            <AssignmentList
                assignments={this.props.assignments}
                selectedAssignment={this.props.selectedAssignment}
                isLoading={this.props.isLoading}
                onAssignmentClick={(a: AssignmentsStore.Assignment) => this.props.selectAssignment(a)}
            />
        );
    }

}

export default connect(
    (state: ApplicationState) => state.assignments,
    AssignmentsStore.actionCreators
)(Assignments) as typeof Assignments;
