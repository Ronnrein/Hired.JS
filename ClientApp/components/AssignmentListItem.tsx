import * as React from "react";
import { Image, Item, Icon } from "semantic-ui-react";
import { Assignment } from "../store/AssignmentList";

type Props = {
    assignment: Assignment;
    selected: boolean;
    onClick?: any;
}

class TaskListItem extends React.Component<Props, {}> {
        render() {
        let assignment = this.props.assignment;
        let image = `/images/workers/${assignment.messages[0].author.id}.jpg`;
        return (
            <Item onClick={(e: Event) => this.props.onClick(e)} className="cursor-pointer" id={this.props.selected ? "selected-assignment" : ""}>
                <Item.Image src={image} size="tiny" shape="circular" />
                <Item.Content>
                    <Item.Header>
                        <Icon name="checkmark" color="green" />
                        <span className="assignment-list-header">{assignment.title}</span>
                        {this.props.selected &&
                            <Icon name="angle double right" />
                        }
                    </Item.Header>
                    <Item.Meta>{assignment.messages[0].author.name}</Item.Meta>
                    <Item.Description>{assignment.name}</Item.Description>
                </Item.Content>
            </Item>
        );
    }
}

export default TaskListItem;