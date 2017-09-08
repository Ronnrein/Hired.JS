import * as React from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export class NavMenu extends React.Component<{}, {}> {
    render() {
        return (
            <Menu className="huge">
                <Menu.Item as={Link} to="/">Home</Menu.Item>
                <Menu.Item as={Link} to="/assignments">Assignments</Menu.Item>
                <Menu.Item as={Link} to="/editor">Editor</Menu.Item>
            </Menu>
        );
    }
}
