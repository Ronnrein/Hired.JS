import * as React from "react";
import { Segment, Grid, Header, Icon, Item, Feed, Divider } from "semantic-ui-react";
import { Assignment } from "../../store/Threads";
import { Script } from "../../store/Scripts";
import { VerificationResult } from "../../store/editor";
import { ConsoleEntry } from "../../store/console";
import EditorForm from "./EditorForm";
import EditorToolbar from "./EditorToolbar";
import EditorAce from "./EditorAce";
import EditorDocumentation from "./EditorDocumentation";
import { default as ConsoleComponent } from "../../containers/Console";
import { convertNewLine } from "../../utils";

type Props = {
    assignment: Assignment;
    result?: VerificationResult;
    isLoading: boolean;
    isSaving: boolean;
    onValueChange: Function;
    script: Script;
    consoleAppend: Function;
    onRunClick: Function;
    onVerifyClick: Function;
    onSaveClick: Function;
}

class Editor extends React.Component<Props, {}> {
    render() {
        return (
            <div>
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
                                <Segment id="thread-body" loading={this.props.isLoading}>
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
                                        <Feed.Label image="/images/workers/0.jpg" />
                                        <Feed.Content>
                                            <Feed.Summary>
                                                <Feed.User as="span">Hired.JS</Feed.User>
                                                <Feed.Date>AI</Feed.Date>
                                            </Feed.Summary>
                                            <Feed.Extra text>{convertNewLine(this.props.assignment.summary)}</Feed.Extra>
                                        </Feed.Content>
                                    </Feed.Event>
                                    <Divider />
                                    {this.props.assignment.documentation.map((doc, i) =>
                                        <EditorDocumentation key={i} doc={doc} />
                                    )}
                                </Item.Group>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <EditorForm
                                    assignment={this.props.assignment}
                                    consoleAppend={(c: ConsoleEntry) => this.props.consoleAppend(c)}
                                    onRunClick={(args: string[]) => this.props.onRunClick(args)}
                                    onVerifyClick={() => this.props.onVerifyClick()}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <ConsoleComponent />
            </div>
        );
    }
}

export default Editor;
