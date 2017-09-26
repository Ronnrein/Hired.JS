import * as React from "react";
import { Segment, Grid, Header, Icon, Item, Feed } from "semantic-ui-react";
import { Assignment } from "../../store/Assignments";
import { Script } from "../../store/Scripts";
import { VerificationResult } from "../../store/editor";
import EditorConsole from "./EditorConsole";
import EditorForm from "./EditorForm";
import EditorToolbar from "./EditorToolbar";
import EditorAce from "./EditorAce";
import EditorSuccess from "./EditorSuccess";
import { convertNewLine } from "../../utils";

type Props = {
    assignment: Assignment;
    result?: VerificationResult;
    isLoading: boolean;
    isSaving: boolean;
    onValueChange: Function;
    script: Script;
    console: string;
    addToConsole: Function;
    onRunClick: Function;
    onVerifyClick: Function;
    onSaveClick: Function;
}

class Editor extends React.Component<Props, {}> {
    render() {
        const message = this.props.assignment.messages[0];
        const image = `/images/workers/${message.author.id}.jpg`;
        return (
            <div>
                <EditorSuccess result={this.props.result} />
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
                                    <Segment attached="top" className="no-padding">
                                        <EditorToolbar
                                            script={this.props.script}
                                            isSaving={this.props.isSaving}
                                            onSaveClick={() => this.props.onSaveClick()} />
                                    </Segment>
                                    <Segment attached id="editor-container">
                                        <EditorAce
                                            readOnlyLines={this.props.assignment.readOnlyLines}
                                            value={this.props.script.text}
                                            onValueChange={(value: string) => this.props.onValueChange(value)}
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
                                    onVerifyClick={() => this.props.onVerifyClick()}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <EditorConsole value={this.props.console} />
            </div>
        );
    }
}

export default Editor;
