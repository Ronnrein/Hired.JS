import * as React from "react";
import { Message as MessageComponent } from "semantic-ui-react";
import { Message } from "../../store/App";

type Props = {
    message: Message;
}

export default class StatusMessage extends React.Component<Props, {}> {
    render() {
        return (
            <MessageComponent
                icon={this.props.message.icon}
                header={this.props.message.title}
                content={this.props.message.text}
                className={this.props.message.status}
                size="tiny"
            />
        );
    }
}
