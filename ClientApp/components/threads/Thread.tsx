import * as React from "react";
import { Comment, Segment, Icon, Feed } from "semantic-ui-react";
import { Thread as IThread } from "../../store/Threads";
import ThreadMessage from "./ThreadMessage";
import Scripts from "../../containers/Scripts";

type Props = {
    thread: IThread;
}

export default class Thread extends React.Component<Props, {}> {
    render() {
        let thread = this.props.thread;
        return (
            <div id="thread-body">
                <Segment attached="top">
                    <Comment.Group size="large">
                        <Comment>
                            <Comment.Content>
                                <Comment.Author as="span">{thread.title}</Comment.Author>
                                {thread.assignment &&
                                    <Comment.Metadata>{`Assignment ${thread.assignment.id}`}</Comment.Metadata>
                                }
                                <Comment.Text><div>{thread.assignment ? thread.assignment.name : "Social"}</div></Comment.Text>
                            </Comment.Content>
                        </Comment>
                    </Comment.Group>
                </Segment>
                <Segment as={Feed} attached>
                    {this.getMessages()}
                </Segment>
                {thread.assignment &&
                    <Segment attached="bottom" clearing>
                        <Scripts />
                    </Segment>
                }
            </div>
        );
    }

    getMessages() {
        let messages: JSX.Element[] = [];
        this.props.thread.messages.map((message, i) => {
            messages.push(<ThreadMessage key={i} message={message}/>);
        });
        if (this.props.thread.assignment && this.props.thread.assignment.completed) {
            let i = messages.length;
            messages.push(<ThreadMessage ai={true} key={i++} message={{ author: { id: 0, name: "Hired.JS", position: "AI" }, text: "Assignment complete" }} />);
            this.props.thread.completedMessages.map((message, j) => {
                messages.push(<ThreadMessage key={i+j} message={message}/>);
            });
        }
        return messages;
    }
}
