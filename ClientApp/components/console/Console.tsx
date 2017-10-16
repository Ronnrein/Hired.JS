import * as React from "react";
import { Segment, List, Transition } from "semantic-ui-react";
import { ConsoleEntry } from "../../store/Console";
import { default as ConsoleEntryComponent } from "./ConsoleEntry";

type Props = {
    entries: ConsoleEntry[];
}

export default class Console extends React.Component<Props, {}> {
    private container: HTMLElement;
    private autoScroll: boolean;

    componentWillUpdate() {
        this.autoScroll = this.container.scrollTop + this.container.offsetHeight === this.container.scrollHeight;
    }

    componentDidUpdate() {
        if (this.autoScroll) {
            this.container.scrollTop = this.container.scrollHeight;
        }
    }

    render() {
        return (
            <Segment as="div" attached="bottom" id="console" inverted>
                <div id="console-shadow"></div>
                <div id="console-messages" ref={(el: HTMLDivElement) => { this.container = el }}>
                    <Transition.Group as={List} animation="fade down">
                        {this.props.entries.map((entry, i) => <List.Item key={i}><ConsoleEntryComponent entry={entry} /></List.Item>)}
                    </Transition.Group>
                </div>
            </Segment>
        );
    }
}
