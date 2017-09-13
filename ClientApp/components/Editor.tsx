import * as React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as brace from "brace";
import AceEditor from "react-ace";
import * as EditorStore from "../store/Editor";
import "brace/mode/javascript";
import "brace/theme/monokai";
import { Grid, Segment, Item, Header, Icon, Feed, Comment, Button, Input, Label, Divider, Popup } from "semantic-ui-react";
import EditorConsole from "./EditorConsole";

type EditorProps =
    EditorStore.EditorState
    & typeof EditorStore.actionCreators
    & RouteComponentProps<{ id: string }>;

class Editor extends React.Component<EditorProps, {}> {
    state = {
        mounted: false,
        arguments: Array(0)
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
            this.setState({
                arguments: Array(this.props.assignment.arguments.length).fill("")
            });
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
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Item.Group divided>

                            </Item.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.renderRunForm()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <EditorConsole value={this.props.console} />
        </div> : null);
    }

    private renderRunForm() {
        let args = this.props.assignment.arguments;
        let fields: any[] = [];
        for (let i = 0; i < args.length; i++) {
            if(i > 0) {
                fields.push(<Label size="large" key={`l${i}`}>,</Label>);
            }
            fields.push(<Popup
                trigger={<Input placeholder={args[i].description} onChange={(e: any) => this.onArgumentChange(i, e.target.value)} />}
                on="focus"
                content={`Example: ${args[i].example}`}
                position="top center"
                size="tiny"
                inverted
                key={`p${i}`}
            />);
        }
        return (
            <div id="run-input">
                <Label size="large">console.log({this.props.assignment.function}(</Label>
                {fields}
                <Label size="large">));</Label>
                <Button positive onClick={() => this.onRunClick()}>Run</Button>
                <Button primary>Verify script</Button>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.editor,
    EditorStore.actionCreators
)(Editor) as typeof Editor;
