import * as React from "react";
import { List, Button } from "semantic-ui-react";
import { Script } from "../../store/Scripts";
import TimeAgo from "react-timeago";

type Props = {
    script: Script;
    selected: boolean;
    onClick: Function;
    onDeleteClick: Function;
}

class ScriptItem extends React.Component<Props, {}> {
    render() {
        return (
            <List.Item onClick={() => this.props.onClick(this.props.script)} className="cursor-pointer">
                <List.Content floated="right">
                    <Button negative icon="trash" size="tiny" onClick={() => this.props.onDeleteClick(this.props.script)} />
                </List.Content>
                {this.props.script.isVerified ? (
                    <List.Icon color="green" size="large" verticalAlign="middle" name="checkmark" />
                ) : (
                    <List.Icon size="large" verticalAlign="middle" name="pencil" />
                )}
                <List.Content>
                    <List.Header className={this.props.selected ? "underlined" : ""}>{this.props.script.name}</List.Header>
                    <List.Description>Last updated <TimeAgo date={this.props.script.modifiedOn} /></List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

export default ScriptItem;
