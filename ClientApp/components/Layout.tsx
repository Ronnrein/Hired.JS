import * as React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { User } from "../store/User";
import NavMenu from "./NavMenu";
import Home from "../components/Home";
import Editor from "../containers/Editor";
import Assignments from "../containers/Assignments";

type Props = {
    user: User;
}

export default class Layout extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                <NavMenu user={this.props.user} />
                <Container>
                    <Route path="/home" component={Home} />
                    <Route path="/editor/:id?" component={Editor} />
                    <Route path="/assignments" component={Assignments} />
                </Container>
            </div>
        );
    }
}
