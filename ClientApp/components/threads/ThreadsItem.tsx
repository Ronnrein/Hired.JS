import * as React from "react";
import { Item, Icon } from "semantic-ui-react";
import { Thread as Thread } from "../../store/Threads";

type Props = {
    thread: Thread;
    selected: boolean;
    onClick?: any;
}

export default class ThreadsItem extends React.Component<Props, {}> {
        render() {
        let thread = this.props.thread;
        let image = `/images/workers/${thread.messages[0].author.id}.jpg`;
        return (
            <Item onClick={(e: Event) => this.props.onClick(e)} className="cursor-pointer" id={this.props.selected ? "selected-thread" : ""}>
                <Item.Image src={image} size="tiny" shape="circular" />
                <Item.Content>
                    <Item.Header>
                        {(thread.assignment && thread.assignment.completed) &&
                            <Icon name="checkmark" color="green" />
                        }
                        <span className="thread-list-header">{thread.title}</span>
                        {this.props.selected &&
                            <Icon name="angle double right" />
                        }
                    </Item.Header>
                    <Item.Meta>{thread.messages[0].author.name}</Item.Meta>
                    <Item.Description>{thread.assignment ? thread.assignment.name : "Social"}</Item.Description>
                </Item.Content>
            </Item>
        );
    }
}
