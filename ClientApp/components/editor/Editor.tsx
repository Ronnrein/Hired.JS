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
        silent: false
    };

    componentDidMount() {
        this.props.onValueChange(this.props.value);
        this.setState({mounted: true});
    }

    onEditorLoad(editor: any) {
        editor.keyBinding.addKeyboardHandler(
            (ace: any, hash: any, keyCode: number) => this.handleEditorInput(ace, hash, keyCode, this.intersectsReadOnlyArea)
        );
        beforeEvent(editor, "onPaste", (next: Function) => this.handleEditorCutPaste(next, editor));
        beforeEvent(editor, "onCut", (next: Function) => this.handleEditorCutPaste(next, editor));
    }

    handleEditorInput(ace: any, hash: any, keyCode: number, intersectFunc: Function): any {
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
        if(this.intersectsReadOnlyArea(editor)) {
            return;
        }
        next();
    }

    intersectsReadOnlyArea(editor: any) {
        const lines = editor.session.doc.getAllLines().length;
        const ranges = { top: {
            start: { row: 0, column: 0 },
            end: { row: 1, column: 100 }
        }, bottom: {
            start: { row: lines - 1, column: 0 },
            end: { row: lines, column: 100 }
        }};

        return editor.getSelectionRange().intersects(ranges.top)
            || editor.getSelectionRange().intersects(ranges.bottom);
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
