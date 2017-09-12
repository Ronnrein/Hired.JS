import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as brace from "brace";
import AceEditor from "react-ace";
import * as EditorStore from "../store/Editor";
import "brace/mode/javascript";
import "brace/theme/monokai";
import { Grid, Segment, Item, Header, Icon, Feed, Comment, Button, Input, Label, Divider } from "semantic-ui-react";
import EditorConsole from "./EditorConsole";

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
        if(id === this.props.assignment.id) {
            return this.onValueChange(this.props.value);
        }
        Promise.resolve(this.props.loadAssignment(id)).then(() => {
            this.onValueChange(this.props.assignment.template);
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
        if (this.state.arguments.indexOf("") !== -1) {
            this.props.addToConsole("Please set arguments to run function");
            return;
        }
        
        this.props.runScript(this.props.assignment.id, this.props.value, this.state.arguments);
    }

    public render() {
        let a = this.props.assignment;
        return (this.state.mounted ? <div>
            <Header as="h2" attached="top">
                <Icon name="code" />
                <Header.Content>
                    Editor
                    <Header.Subheader>{a.id === 0 ? "Code editor" : `Assignment ${a.id}`}</Header.Subheader>
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
                                        editorProps={{ $blockScrolling: true }}
                                        onChange={script => this.onValueChange(script)}
                                        value={this.props.value}
                                    />
                                </Segment>
                                <Segment attached="bottom">
                                    <div id="run-input">
                                        <Input label="console.log(add(" placeholder="0" onChange={(e: any) => this.onArgumentChange(0, e.target.value)} />
                                        <Input labelPosition="right" placeholder="0" onChange={(e: any) => this.onArgumentChange(1, e.target.value)}>
                                            <Label>,</Label>
                                            <input />
                                            <Label>));</Label>
                                            <Button positive onClick={() => this.onRunClick()}>Run</Button>
                                        </Input>
                                        <Button primary>Verify script</Button>
                                    </div>
                                </Segment>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Item.Group divided>

                            </Item.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <EditorConsole value={this.props.console} />
        </div> : null);
    }
}

export default connect(
    (state: ApplicationState) => state.editor,
    EditorStore.actionCreators
)(Editor) as typeof Editor;