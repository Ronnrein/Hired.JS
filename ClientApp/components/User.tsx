import * as React from "react";
import { User } from "../store/User";
import { Input, Button, Icon, Checkbox, Popup, Menu, Divider, Header, Modal } from "semantic-ui-react";
import { Message } from "../store/App";
import StatusMessage from "./shared/StatusMessage";

type Props = {
    user: User;
    message?: Message;
    isLoading: boolean;
    isUpdatingUsername: boolean;
    isUpdatingPassword: boolean;
    onUpdateUsernameClick: Function;
    onUpdatePasswordClick: Function;
    onLogoutClick: Function;
}

class Editor extends React.Component<Props, {}> {
    state = {
        userName: this.props.user.userName,
        password: "",
        passwordEnabled: this.props.user.isPasswordEnabled,
        passwordDisableModal: false
    }

    onPasswordToggle(data: any) {
        if(this.props.user.isPasswordEnabled && !data.checked) {
            this.setState({passwordDisableModal: true });
        } else {
            this.setState({passwordEnabled: data.checked});
        }
    }

    onPasswordUpdateClick() {
        this.setState({password: ""});
        this.props.onUpdatePasswordClick(this.state.password);
    }

    onPasswordDisableClick() {
        this.setState({
            passwordEnabled: false,
            passwordDisableModal: false,
            password: "",
        });
        this.props.onUpdatePasswordClick(null);
    }

    render() {
        return (
            <span>
                <Popup
                    trigger={<Menu.Item><Icon name="user" />{this.props.user.userName}<Icon name="dropdown" /></Menu.Item>}
                    on="click"
                    position="bottom left"
                    id="user-modal"
                >
                    {this.props.message !== undefined &&
                        <StatusMessage message={this.props.message} />
                    }
                    <Header>Update username</Header>
                    <Input placeholder="Username..." iconPosition="left" loading={this.props.isUpdatingUsername} action>
                        <Icon name="tag" />
                        <input defaultValue={this.props.user.userName} onChange={(e: any) => this.setState({userName: e.target.value})} />
                        <Button
                            disabled={this.state.userName === this.props.user.userName}
                            positive
                            icon="checkmark"
                            onClick={() => this.props.onUpdateUsernameClick(this.state.userName)}
                        />
                    </Input>
                    <Divider />
                    <Header>
                        Password protection
                        <Checkbox
                            toggle
                            onChange={(e: any, data: any) => this.onPasswordToggle(data)}
                            className="float-right"
                            checked={this.state.passwordEnabled}
                        />
                    </Header>
                    <Input
                        placeholder="Update password..."
                        iconPosition="left"
                        loading={this.props.isUpdatingPassword}
                        action
                        disabled={!this.state.passwordEnabled}
                        value={this.state.password}
                    >
                        <Icon name="key" />
                        <input type="password" onChange={(e: any) => this.setState({password: e.target.value})} />
                        <Button
                            disabled={this.state.userName === ""}
                            positive
                            icon="checkmark"
                            onClick={() => this.onPasswordUpdateClick()}
                        />
                    </Input>
                    <Divider />
                    <Button fluid onClick={() => this.props.onLogoutClick()}>Log out</Button>
                </Popup>
                <Modal open={this.state.passwordDisableModal}>
                    <Header icon="trash" content="Disable password protection?" />
                    <Modal.Content>Do you want to disable password protection for your profile?</Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => this.setState({passwordDisableModal: false})}>
                            <Icon name="cancel" /> Cancel
                        </Button>
                        <Button onClick={() => this.onPasswordDisableClick()} color="red">
                            <Icon name="trash" /> Disable
                        </Button>
                    </Modal.Actions>
                </Modal>
            </span>
        );
    }
}

export default Editor;
