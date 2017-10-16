import * as React from "react";
import { List, SemanticICONS } from "semantic-ui-react";
import { ConsoleEntry as IConsoleEntry } from "../../store/Console";

type Props = {
    entry: IConsoleEntry;
}

export default class ConsoleEntry extends React.Component<Props, {}> {
    render() {
        return [
            <List.Icon key="icon" name={this.props.entry.icon as SemanticICONS} />,
            <List.Content key="content" className={this.props.entry.status}>
                <b>{this.props.entry.title}</b>{this.props.entry.text &&
                    <span>: {this.props.entry.text}</span>
                }
            </List.Content>
        ];
    }
}
