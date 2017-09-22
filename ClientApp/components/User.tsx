import * as React from "react";
import { User } from "../store/User";
import { Dropdown, Input, Button, Icon } from "semantic-ui-react";

type Props = {
    user: User;
    isLoading: boolean;
    onUpdateUsernameClick: Function;
    onLogoutClick: Function;
}

class Editor extends React.Component<Props, {}> {
    state = {
        userName: this.props.user.userName
    }

    // Workaround for semantic bug regarding dropdown click
    onClick(e: Event) {
        e.stopPropagation();
    }

    onUsernameChange(value: string) {
        this.setState({
            userName: value
        });
    }

    render() {
        return (
            <Dropdown item text={this.props.user.userName}>
                <Dropdown.Menu onClick={(e: Event) => this.onClick(e)}>
                    <Dropdown.Header content="Update username" />
                    <Input placeholder="Username..." iconPosition="left" loading={this.props.isLoading} action>
                        <Icon name="tag" />
                        <input defaultValue={this.props.user.userName} onChange={(e: any) => this.onUsernameChange(e.target.value)} />
                        <Button positive icon="checkmark" onClick={() => this.props.onUpdateUsernameClick(this.state.userName)} />
                    </Input>
                    <Button fluid onClick={() => this.props.onLogoutClick()}>Log out</Button>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default Editor;
