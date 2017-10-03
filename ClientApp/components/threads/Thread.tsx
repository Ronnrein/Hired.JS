import * as React from "react";
import { Comment, Segment, Feed } from "semantic-ui-react";
import { Thread as IThread, Message } from "../../store/Threads";
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
                    {this.props.thread.messages.map((message, i) => {
                        return <ThreadMessage key={i} message={message}/>;
                    })}
                </Segment>
                {thread.assignment &&
                    <Segment attached="bottom" clearing>
                        <Scripts />
                    </Segment>
                }
            </div>
        );
    }
}
