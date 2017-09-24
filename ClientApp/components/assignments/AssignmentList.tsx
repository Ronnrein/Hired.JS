import * as React from "react";
import { Grid, Segment, Item, Header, Icon } from "semantic-ui-react";
import { Assignment } from "../../store/Assignments";
import AssignmentListItem from "./AssignmentListItem";
import { default as AssignmentComponent } from "./Assignment";

type Props = {
    assignments: Assignment[];
    selectedAssignment?: Assignment;
    isLoading: boolean;
    onAssignmentClick: Function;
}

class AssignmentList extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                <Header as="h2" attached="top">
                    <Icon name="file text" />
                    <Header.Content>
                        Assignments
                        <Header.Subheader>Your assignments and conversations</Header.Subheader>
                    </Header.Content>
                </Header>
                <Segment attached className="no-padding" loading={this.props.isLoading}>
                    <Grid celled stackable className="no-margin">
                        <Grid.Row>
                            <Grid.Column width={5}>
                                <Item.Group divided>
                                    {this.props.assignments.map(assignment =>
                                        <AssignmentListItem
                                            key={assignment.id}
                                            assignment={assignment}
                                            onClick={() => this.props.onAssignmentClick(assignment)}
                                            selected={this.props.selectedAssignment !== undefined && this.props.selectedAssignment.id === assignment.id} />
                                    )}
                                </Item.Group>
                            </Grid.Column>
                            <Grid.Column width={11} className="no-padding">
                                {this.props.selectedAssignment !== undefined ? (
                                    <AssignmentComponent assignment={this.props.selectedAssignment} />
                                ) : (
                                    <Header as="h2" icon textAlign="center">
                                        <Icon name="mail" />
                                        Messages
                                        <Header.Subheader>Select a message to view</Header.Subheader>
                                    </Header>
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment attached="bottom">
                    Test
                </Segment>
            </div>
        );
    }
}

export default AssignmentList;
