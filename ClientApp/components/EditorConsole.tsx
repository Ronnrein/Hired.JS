import * as React from "react";
import { Segment } from "semantic-ui-react";
import { convertNewLine } from "../utils";

type Props = {
    value: string;
}

class EditorConsole extends React.Component<Props, {}> {
    private bottom: HTMLSpanElement;

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return (
            <Segment attached="bottom" id="editor-console" inverted>
                <div id="editor-console-shadow"></div>
                <div id="editor-console-messages">
                    {convertNewLine(this.props.value)}
                    <span ref={(el: HTMLSpanElement) => { this.bottom = el }}></span>
                </div>
            </Segment>
        );
    }

    scrollToBottom() {
        this.bottom.scrollIntoView();
    }
}

export default EditorConsole;