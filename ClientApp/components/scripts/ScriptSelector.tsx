import * as React from "react";
import { Link } from "react-router-dom";
import * as brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/theme/monokai";
import { Modal, Button, Header, Icon, Grid, Segment, List, Input } from "semantic-ui-react";
import { Assignment } from "../../store/Assignments";
import { Script } from "../../store/Scripts";
import ScriptItem from "./ScriptItem";

type Props = {
    assignment: Assignment;
    scripts: Script[];
    selectedScript?: Script;
    isLoading: boolean;
    isSaving: boolean;
    onLoadAssignmentClick: Function;
    onCreateClick: Function;
    onDeleteClick: Function;
    onModalOpen: Function;
    onSelectScript: Function;
}

class ScriptSelector extends React.Component<Props, {}> {
    state = {
        newName: ""
    }

    onCreateClick() {
        this.setState({
            newScriptName: ""
        });
        this.props.onCreateClick(this.state.newName);
    }

    render() {
        return (
            <Modal trigger={
                <Button positive floated="right" onClick={() => this.props.onModalOpen()}>Go to editor</Button>
            } closeIcon>
                <Header
                    icon="file text"
                    content={`Assignment ${this.props.assignment.id}: ${this.props.assignment.name}`}
                />
                <Modal.Content className="no-padding">
                    <Segment loading={this.props.isLoading} className="no-padding">
                        <Grid celled stackable className="no-margin">
                            <Grid.Row>
                                <Grid.Column width={6}>
                                    <List divided relaxed>
                                        {this.props.scripts.map(script =>
                                            <ScriptItem
                                                key={script.id}
                                                script={script}
                                                selected={script === this.props.selectedScript}
                                                onClick={(s: Script) => this.props.onSelectScript(s)}
                                                onDeleteClick={(s: Script) => this.props.onDeleteClick(s)}
                                            />
                                        )}
                                        <List.Item>
                                            <List.Content>
                                                <Input placeholder="Name..." loading={this.props.isSaving} action fluid>
                                                    <input onChange={(e: any) => this.setState({newName: e.target.value})} value={this.state.newName} />
                                                    <Button
                                                        disabled={this.state.newName === "" || this.props.isSaving}
                                                        positive
                                                        icon="plus"
                                                        onClick={() => this.onCreateClick()}
                                                    />
                                                </Input>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={10} className="no-padding">
                                    <AceEditor
                                        mode="javascript"
                                        theme="monokai"
                                        name="preview"
                                        editorProps={{
                                            $blockScrolling: Infinity
                                        }}
                                        setOptions={{
                                            showLineNumbers: true
                                        }}
                                        value={this.props.selectedScript !== undefined ? this.props.selectedScript.text : ""}
                                        readOnly
                                        highlightActiveLine={false}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        as={Link}
                        to="/editor"
                        positive
                        onClick={() => this.props.onLoadAssignmentClick()}
                        disabled={this.props.isLoading}>
                        <Icon name="checkmark" />
                        Go to editor
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ScriptSelector;
