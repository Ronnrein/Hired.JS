import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as EditorStore from "../store/Editor";
import { actionCreators as scriptsActions } from "../store/Scripts";
import { actionCreators as threadsActions } from "../store/Threads";
import { default as EditorComponent } from "../components/editor/Editor";

type ImportedProps = {
    saveScript: Function;
    requestThreads: Function;
    isSaving: boolean;
}

type EditorProps =
    EditorStore.EditorState
    & ImportedProps
    & typeof EditorStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class Editor extends React.Component<EditorProps, {}> {
    componentWillReceiveProps(next: EditorProps) {
        if(!this.props.result && next.result) {
            this.props.requestThreads();
        }
    }

    public render() {
        return (
            <EditorComponent
                result={this.props.result}
                assignment={this.props.assignment}
                isLoading={this.props.isLoading}
                isSaving={this.props.isSaving}
                console={this.props.console}
                script={this.props.script}
                addToConsole={(s: string) => this.props.addToConsole(s)}
                onValueChange={(v: string) => this.props.valueChange(v)}
                onRunClick={(args: string[]) => this.props.runScript(args)}
                onVerifyClick={() => this.props.verifyScript()}
                onSaveClick={() => this.props.saveScript(this.props.script)}
            />
        );

    }
}

export default connect(
    (state: ApplicationState) => ({...state.editor, ...{
        isSaving: state.scripts.isSaving
    }}),
    ({...EditorStore.actionCreators, ...{
        saveScript: scriptsActions.saveScript,
        requestThreads: threadsActions.requestThreads
    }})
)(Editor) as typeof Editor;
