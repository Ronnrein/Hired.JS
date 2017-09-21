import * as React from "react";
import * as brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/theme/monokai";
import { Segment, Grid, Header, Icon, Item, Feed } from "semantic-ui-react";
import { Assignment } from "../../store/Assignments";
import EditorConsole from "./EditorConsole";
import EditorForm from "./EditorForm";
import { convertNewLine } from "../../utils";

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
    };

    componentDidMount() {
        this.setState({
            mounted: true
        });
        this.props.onValueChange(this.props.value);
    }

    render() {
        let message = this.props.assignment.messages[0];
        let image = `/images/workers/${message.author.id}.jpg`;
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
                                        editorProps={{ $blockScrolling: true }}
                                        onChange={script => this.props.onValueChange(script)}
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
