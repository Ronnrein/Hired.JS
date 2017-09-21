import * as React from "react";
import { Comment, Segment, Button, Icon, Feed } from "semantic-ui-react";
import { Assignment as IAssignment } from "../../store/Assignments";
import AssignmentMessage from "./AssignmentMessage";

type Props = {
    assignment: IAssignment;
    onLoadAssignmentClick: Function;
}

class Assignment extends React.Component<Props, {}> {
    render() {
        return (
            <div id="assignment-body">
                <Segment attached="top">
                    <Comment.Group size="large">
                        <Comment>
                            <Comment.Avatar as={Icon} size="big" name="plus" />
                            <Comment.Content>
                                <Comment.Author as="span">{this.props.assignment.title}</Comment.Author>
                                <Comment.Metadata><div>Task {this.props.assignment.id}</div></Comment.Metadata>
                                <Comment.Text>{this.props.assignment.name}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    </Comment.Group>
                </Segment>
                <Segment as={Feed} attached>
                    {this.props.assignment.messages.map((message, i) => {
                        return <AssignmentMessage key={i} message={message} />
                    })}
                </Segment>
                <Segment attached="bottom">
                    <Button
                        floated="right"
                        positive
                        onClick={() => this.props.onLoadAssignmentClick(this.props.assignment)}>
                        Go to editor
                    </Button>
                </Segment>
            </div>
        );
    }
}

export default Assignment;