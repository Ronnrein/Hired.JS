import * as React from "react";
import { User } from "../store/User";
import { Dropdown, Input, Item } from "semantic-ui-react";

type Props = {
    user: User;
}

class Editor extends React.Component<Props, {}> {
    state = {
        userNameInput: this.props.user.userName
    }

    onClick(e: Event) {
        e.stopPropagation();
    }

    render() {
        return (
            <Dropdown item text={this.props.user.userName}>
                <Dropdown.Menu onClick={(e: Event) => this.onClick(e)}>
                    <Dropdown.Header size="large" content="Manage user" />
                    <Dropdown.Divider />
                    <Dropdown.Header content="Update username" />
                    <Input icon="tag" placeholder="Username..." value={this.props.user.userName} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default Editor;
