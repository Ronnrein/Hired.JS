import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";
import { default as UserComponent } from "../containers/User";

type Props = {
    currentPath: string;
}

export default class NavMenu extends React.Component<Props, {}> {
    render() {
        return (
            <Menu className="huge">
                <Menu.Item as={Link} to="/" active={this.props.currentPath === "/"}>
                    <Icon name="home" />
                    Home
                </Menu.Item>
                <Menu.Item as={Link} to="/threads" active={this.props.currentPath === "/threads"}>
                    <Icon name="mail" />
                    Inbox
                </Menu.Item>
                <Menu.Item as={Link} to="/editor" active={this.props.currentPath === "/editor"}>
                    <Icon name="code" />
                    Editor
                </Menu.Item>
                <Menu.Menu position="right">
                    <UserComponent />
                </Menu.Menu>
            </Menu>
        );
    }
}
