import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as EditorStore from "../store/Editor";
import { Grid, Segment, Item, Header, Icon, Feed, Button, Input, Label, Popup } from "semantic-ui-react";
import { default as EditorComponent } from "../components/editor/Editor";
import { convertNewLine } from "../utils";

type EditorProps =
    EditorStore.EditorState
    & typeof EditorStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class Editor extends React.Component<EditorProps, {}> {
    public render() {
        return (
            <EditorComponent
                assignment={this.props.assignment}
                isLoading={this.props.isLoading}
                console={this.props.console}
                value={this.props.value}
                addToConsole={(s: string) => this.props.addToConsole(s)}
                onValueChange={(v: string) => this.props.valueChange(v)}
                onRunClick={(args: string[]) => this.props.runScript(args)}
                onVerifyClick={() => this.props.verifyScript()}
            />
        );

    }
}

export default connect(
    (state: ApplicationState) => state.editor,
    EditorStore.actionCreators
)(Editor) as typeof Editor;
