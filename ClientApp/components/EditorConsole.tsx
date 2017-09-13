import * as React from "react";
import { Segment } from "semantic-ui-react";
import { convertNewLine } from "../utils";

type Props = {
    value: string;
}

class EditorConsole extends React.Component<Props, {}> {
  private container: HTMLElement;
  private autoScroll: boolean;

    componentWillUpdate() {
        this.autoScroll = this.container.scrollTop + this.container.offsetHeight === this.container.scrollHeight;
    }

    componentDidUpdate() {
        if(this.autoScroll) {
            this.container.scrollTop = this.container.scrollHeight;
        }
    }

    render() {
        return (
            <Segment as="div" attached="bottom" id="editor-console" inverted>
                <div id="editor-console-shadow"></div>
                <div id="editor-console-messages" ref={(el: HTMLDivElement) => { this.container = el }}>
                    {convertNewLine(this.props.value)}
                </div>
            </Segment>
        );
    }
}

export default EditorConsole;
