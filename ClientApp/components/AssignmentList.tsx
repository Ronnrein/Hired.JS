import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as AssignmentListStore from "../store/AssignmentList";
import AssignmentListItem from "./AssignmentListItem";
import { Assignment, Message, Worker } from "../store/AssignmentList";
import { Grid, Segment, Item, Header, Icon, Feed, Comment, Button } from "semantic-ui-react";
import { convertNewLine } from "../utils";
import { actionCreators as editorActions } from "../store/Editor";

type AssignmentListProps =
    AssignmentListStore.AssignmentListState
    & typeof AssignmentListStore.actionCreators
    & RouteComponentProps<{}>;

class AssignmentList extends React.Component<AssignmentListProps, {}> {

    componentDidMount() {
        if(this.props.assignments.length === 0) {
            this.props.requestAssignments();
        } 
    }

    onAssignmentClick(assignment: Assignment) {
        this.props.selectAssignment(assignment);
    }

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
                                            onClick={() => this.onAssignmentClick(assignment)}
                                            selected={this.props.selectedAssignment !== undefined && this.props.selectedAssignment.id === assignment.id} />
                                    )}
                                </Item.Group>
                            </Grid.Column>
                            <Grid.Column width={11} className="no-padding">
                                {this.renderAssignment()}
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

    renderAssignment() {
        if(this.props.selectedAssignment === undefined) {
            return (
                <Header as="h2" icon textAlign="center">
                    <Icon name="mail" />
                    Messages
                    <Header.Subheader>Select a message to view</Header.Subheader>
                </Header>
            );
        }
        let assignment = this.props.selectedAssignment;
        let url = `/editor/${assignment.id}`;
        return (
            <div id="assignment-body">
                <Segment attached="top">
                    <Comment.Group size="large">
                        <Comment>
                            <Comment.Avatar as={Icon} size="big" name="plus" />
                            <Comment.Content>
                                <Comment.Author as="span">{assignment.title}</Comment.Author>
                                <Comment.Metadata><div>Task {assignment.id}</div></Comment.Metadata>
                                <Comment.Text>{assignment.name}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    </Comment.Group>
                </Segment>
                <Segment attached>
                    {this.renderMessages()}
                </Segment>
                <Segment attached="bottom">
                    <Button as={Link} to={url} floated="right" positive>Go to editor</Button>
                </Segment>
            </div>
        );
    }

    renderMessages() {
        let messages: any = [];
        if (this.props.selectedAssignment !== undefined) {
            let m = this.props.selectedAssignment.messages;
            for(let i = 0; i < m.length; i++) {
                messages.push(this.renderMessage(m[i], i));
            }
        }
        return (<Feed>{messages}</Feed>);
    }

    renderMessage(message: Message, k: number) {
        let image = `/images/workers/${message.author.id}.jpg`;
        return (
            <Feed.Event key={k}>
                <Feed.Label image={image} />
                <Feed.Content>
                    <Feed.Summary>
                        <Feed.User as="span">{message.author.name}</Feed.User>
                        <Feed.Date>{message.author.position}</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>{convertNewLine(message.text)}</Feed.Extra>
                </Feed.Content>
            </Feed.Event>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.assignmentList,
    AssignmentListStore.actionCreators
)(AssignmentList) as typeof AssignmentList;