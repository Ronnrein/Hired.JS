import * as React from "react";
import { Item, Icon, SemanticICONS } from "semantic-ui-react";
import { Thread as Thread } from "../../store/Threads";

type Props = {
    thread: Thread;
    selected: boolean;
}

export default class ThreadsItem extends React.Component<Props, {}> {
    render(): any {
        if(this.props.thread.messages.length === 0) {
            return null;
        }
        let thread = this.props.thread;
        let image = `/images/workers/${thread.messages[0].author.id}.jpg`;
        let icon = !thread.assignment ? "talk" : thread.assignment.completed ? "checkmark" : "file text";
        return [
            <Item.Image key="image" src={image} size="tiny" shape="circular" />,
            <Item.Content key="content">
                <Item.Header>
                    <Icon name={icon as SemanticICONS} color={icon === "checkmark" ? "green" : undefined} />
                    <span className="thread-list-header">{thread.title}</span>
                    {this.props.selected &&
                        <Icon name="angle double right" />
                    }
                </Item.Header>
                <Item.Meta>{thread.messages[0].author.name}</Item.Meta>
                <Item.Description>{thread.assignment ? thread.assignment.name : "Social"}</Item.Description>
            </Item.Content>
        ];
    }
}
