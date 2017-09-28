import * as React from "react";
import * as brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/ext/language_tools";
import "brace/theme/monokai";
import "brace/snippets/javascript";
import { beforeEvent } from "../../utils";

type Props = {
    readOnlyLines: number[];
    value: string;
    onValueChange: Function;
}

class EditorAce extends React.Component<Props, {}> {
    state = {
        mounted: false,
        readOnlyRanges: Array()
    }

    componentDidMount() {
        this.setState({ mounted: true });
        this.intersectsReadOnlyArea = this.intersectsReadOnlyArea.bind(this);
        this.handleEditorInput = this.handleEditorInput.bind(this);
    }

    onEditorLoad(editor: any) {
        const { Range } = brace.acequire("ace/range");
        const lines = editor.session.doc.getAllLines().length;
        const readOnlyLines = this.props.readOnlyLines;
        let ranges: any[] = readOnlyLines.length === 0 ? [] : [
            new Range(0, 0, readOnlyLines[0] - 1, 100),
            new Range(lines - readOnlyLines[1], 0, lines, 100)
        ];
        for (let range of ranges) {
            range.start = editor.session.doc.createAnchor(range.start);
            range.end = editor.session.doc.createAnchor(range.end);
            range.end.$insertRight = true;
            editor.session.addMarker(range, "editor-readonly");
        }
        this.setState({ readOnlyRanges: ranges });
        editor.keyBinding.addKeyboardHandler(this.handleEditorInput.bind(this));
        beforeEvent(editor, "onPaste", (next: Function) => this.handleEditorCutPaste(next, editor));
        beforeEvent(editor, "onCut", (next: Function) => this.handleEditorCutPaste(next, editor));
    }

    handleEditorInput(ace: any, hash: any, key: string, keyCode: number): any {
        if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) {
            return false;
        }
        if (this.intersectsReadOnlyArea(ace.editor)) {
            return { command: "null", passEvent: false };
        }
        return true;
    }

    handleEditorCutPaste(next: Function, editor: any) {
        if (!this.intersectsReadOnlyArea(editor)) {
            next();
        }
    }

    intersectsReadOnlyArea(editor: any) {
        for (let range of this.state.readOnlyRanges) {
            if (editor.getSelectionRange().intersects(range)) {
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            <AceEditor
                mode="javascript"
                theme="monokai"
                name="editor"
                editorProps={{
                    $blockScrolling: Infinity
                }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: false,
                    enableSnippets: true,
                    showLineNumbers: true
                }}
                onLoad={(editor: any) => this.onEditorLoad(editor)}
                onChange={(value: string) => this.props.onValueChange(value)}
                value={this.props.value}
            />
        );
    }
}

export default EditorAce;
