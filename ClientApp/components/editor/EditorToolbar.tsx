import * as React from "react";
import { Menu, Icon, Popup } from "semantic-ui-react";
import { Script } from "../../store/Scripts";
import TimeAgo from "../shared/TimeAgo";

type Props = {
    script: Script;
    hint: string;
    isSaving: boolean;
    onSaveClick: Function;
}

class EditorToolbar extends React.Component<Props, {}> {
    state = {
        lastSavedScript: this.props.script.text
    }

    onSaveClick() {
        this.setState({
            lastSavedScript: this.props.script.text
        });
        this.props.onSaveClick();
    }

    render() {
        const unchanged = this.state.lastSavedScript === this.props.script.text;
        return (
            <Menu icon>
                {this.props.script.id !== 0 &&
                    <Menu.Item onClick={() => this.onSaveClick()} disabled={this.props.isSaving || unchanged}>
                        <Icon
                            color={unchanged ? "green" : undefined}
                            name="save"
                            loading={this.props.isSaving}
                        />
                    </Menu.Item>
                }
                <Menu.Menu position="right">
                    <Popup
                        trigger={<Menu.Item icon="idea" content="Hint" />}
                        content={this.props.hint}
                        position="bottom right"
                        wide
                    />
                    <Menu.Item>
                        Last saved&nbsp;<TimeAgo date={this.props.script.modifiedOn} />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default EditorToolbar;
