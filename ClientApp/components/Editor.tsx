import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as brace from "brace";
import AceEditor from "react-ace";
import * as EditorStore from "../store/Editor";
import "brace/mode/javascript";
import "brace/theme/monokai";

type EditorProps =
    EditorStore.EditorState
    & typeof EditorStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class Editor extends React.Component<EditorProps, {}> {
    state = {
        mounted: false,
        arguments: Array(2).fill("")
    };

    componentDidMount() {
        this.setState({ mounted: true });
        let id = +this.props.match.params.id;
        if(Number.isNaN(id)) {
            return;
        }
        if(this.props.assignment !== undefined && id === this.props.assignment.id) {
            return this.onValueChange(this.props.value);
        }
        Promise.resolve(this.props.loadAssignment(id)).then(() => {
            this.onValueChange(this.props.assignment !== undefined ? this.props.assignment.template : "");
        });
    }

    onArgumentChange(argument: number, value: string) {
        let args = this.state.arguments;
        args[argument] = value;
        this.setState({
            arguments: args
        });
    }

    onValueChange(script: string) {
        this.props.valueChange(script);
    }

    onRunClick() {
        if(this.props.assignment === undefined || this.state.arguments.indexOf("") !== -1) {
            return;
        }
        this.props.runScript(this.props.assignment.id, this.props.value, this.state.arguments);
    }

    public render() {
        let text = this.props.assignment !== undefined
            ? this.props.assignment.summary//.split("\n").map((item) => <p>{item}</p>)
            : "";
        return (this.state.mounted ? <div>
            <h1>Editor</h1>
            { text }
            <AceEditor
                mode="javascript"
                theme="monokai"
                name="editor"
                editorProps={{$blockScrolling: true}}
                onChange={script => this.onValueChange(script)}
                value={this.props.value}
            />
            <input type="number" id="argument0" onChange={(e: any) => this.onArgumentChange(parseInt(e.target.id.replace("argument", "")), e.target.value)} />
            <input type="number" id="argument1" onChange={(e: any) => this.onArgumentChange(parseInt(e.target.id.replace("argument", "")), e.target.value)} />
            <button onClick={ () => this.onRunClick() }>Run</button>
            { this.props.result != undefined &&
                <b>Expected { this.props.result.runs[0].correct }, got { this.props.result.runs[0].result }</b>
            }
            {this.props.result != undefined && this.props.result.error != undefined &&
                <b>ERROR: { this.props.result.error }</b>
            }
        </div> : null);
    }
}

export default connect(
    (state: ApplicationState) => state.editor,
    EditorStore.actionCreators
)(Editor) as typeof Editor;