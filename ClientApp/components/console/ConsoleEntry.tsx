import * as React from "react";
import { List } from "semantic-ui-react";
import { ConsoleEntry as IConsoleEntry } from "../../store/Console";

type Props = {
    entry: IConsoleEntry;
}

export default class ConsoleEntry extends React.Component<Props, {}> {
    render() {
        return (
            <List.Item>
                <List.Icon name={this.props.entry.icon} />
                <List.Content className={this.props.entry.status}>
                    <b>{this.props.entry.title}</b>{this.props.entry.text &&
                        <span>: {this.props.entry.text}</span>
                    }
                </List.Content>
            </List.Item>
        );
    }
}
