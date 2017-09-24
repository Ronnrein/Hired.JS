import * as React from "react";
import * as brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/ext/language_tools";
import "brace/theme/monokai";
import "brace/snippets/javascript";
import { Segment, Grid, Header, Icon, Item, Feed } from "semantic-ui-react";
import { Assignment } from "../../store/Assignments";
import EditorConsole from "./EditorConsole";
import EditorForm from "./EditorForm";
import { convertNewLine, beforeEvent } from "../../utils";

type Props = {
    assignment: Assignment;
    isLoading: boolean;
    onValueChange: Function;
    value: string;
    console: string;
    addToConsole: Function;
    onRunClick: Function;
    onVerifyClick: Function;
}

class Editor extends React.Component<Props, {}> {
    state = {
        mounted: false,
        silent: false,
        readOnlyRanges: Array()
    };

    componentDidMount() {
        this.props.onValueChange(this.props.value);
        this.setState({ mounted: true });
        this.intersectsReadOnlyArea = this.intersectsReadOnlyArea.bind(this);
        this.handleEditorInput = this.handleEditorInput.bind(this);
    }

    onEditorLoad(editor: any) {
        const { Range } = brace.acequire("ace/range");
        let ranges: Object[] = [];
        for (let rangeArr of this.props.assignment.readOnlyLines) {
            const range = new Range(rangeArr[0] - 1, 0, rangeArr[1] - 1, 100);
            range.start = editor.session.doc.createAnchor(range.start);
            range.end = editor.session.doc.createAnchor(range.end);
            range.end.$insertRight = true;
            editor.session.addMarker(range, "editor-readonly");
            ranges.push(range);
        }
        this.setState({ readOnlyRanges: ranges });
        editor.keyBinding.addKeyboardHandler(this.handleEditorInput);
        beforeEvent(editor, "onPaste", (next: Function) => this.handleEditorCutPaste(next, editor));
        beforeEvent(editor, "onCut", (next: Function) => this.handleEditorCutPaste(next, editor));
    }

    handleEditorInput(ace: any, hash: any, key: string, keyCode: number): any {
        console.log(ace.editor.session.getAnnotations());
        if(hash === -1 || (keyCode <= 40 && keyCode >= 37)) {
            return false;
        }
        if (this.intersectsReadOnlyArea(ace.editor)) {
            return { command: "null", passEvent: false };
        }
        this.props.onValueChange(ace.editor.getValue());
        return true;
    }

    handleEditorCutPaste(next: Function, editor: any) {
        if(!this.intersectsReadOnlyArea(editor)) {
            next();
        }
    }

    intersectsReadOnlyArea(editor: any) {
        for (let range of this.state.readOnlyRanges) {
            console.log(range);
            if(editor.getSelectionRange().intersects(range)) {
                return true;
            }
        }
        return false;
    }

    render() {
        const message = this.props.assignment.messages[0];
        const image = `/images/workers/${message.author.id}.jpg`;
        return (this.state.mounted ? <div>
            <Header as="h2" attached="top">
                <Icon name="code" />
                <Header.Content>
                    Editor
                    <Header.Subheader>{this.props.assignment.name}</Header.Subheader>
                </Header.Content>
            </Header>
            <Segment attached className="no-padding">
                <Grid celled stackable className="no-margin">
                    <Grid.Row>
                        <Grid.Column width={11} className="no-padding">
                            <Segment id="assignment-body" loading={this.props.isLoading}>
                                <Segment attached="top">
                                    Toolbar
                                </Segment>
                                <Segment attached id="editor-container">
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
                                        value={this.props.value}
                                        highlightActiveLine={false}
                                    />
                                </Segment>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Item.Group as={Feed} divided>
                                <Feed.Event>
                                    <Feed.Label image={image} />
                                    <Feed.Content>
                                        <Feed.Summary>
                                            <Feed.User as="span">{message.author.name}</Feed.User>
                                            <Feed.Date>{message.author.position}</Feed.Date>
                                        </Feed.Summary>
                                        <Feed.Extra text>{convertNewLine(this.props.assignment.summary)}</Feed.Extra>
                                        {message.image !== null &&
                                            <Feed.Extra images><img src={`/images/attachments/${message.image}`} /></Feed.Extra>
                                        }
                                    </Feed.Content>
                                </Feed.Event>
                            </Item.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <EditorForm
                                assignment={this.props.assignment}
                                addToConsole={(s: string) => this.props.addToConsole(s)}
                                onRunClick={(args: string[]) => this.props.onRunClick(args)}
                                onVerifyClick={() => this.props.onVerifyClick}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <EditorConsole value={this.props.console} />
        </div> : null);
    }
}

export default Editor;
