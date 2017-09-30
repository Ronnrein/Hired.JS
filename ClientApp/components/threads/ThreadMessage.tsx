import * as React from "react";
import { Feed } from "semantic-ui-react";
import { Message } from "../../store/Threads";
import { convertNewLine } from "../../utils";

type Props = {
    message: Message
}

export default class ThreadMessage extends React.Component<Props, {}> {
    render() {
        let image = `/images/workers/${this.props.message.author.id}.jpg`;
        return (
            <Feed.Event>
                <Feed.Label image={image} />
                <Feed.Content>
                    <Feed.Summary>
                        <Feed.User as="span">{this.props.message.author.name}</Feed.User>
                        <Feed.Date>{this.props.message.author.position}</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>{convertNewLine(this.props.message.text)}</Feed.Extra>
                    {this.props.message.image &&
                        <Feed.Extra images><img src={`/images/attachments/${this.props.message.image}`} /></Feed.Extra>
                    }
                </Feed.Content>
            </Feed.Event>
        );
    }
}
