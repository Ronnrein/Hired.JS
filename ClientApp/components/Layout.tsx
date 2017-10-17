import * as React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import NavMenu from "./NavMenu";
import Home from "../components/Home";
import Editor from "../containers/Editor";
import Threads from "../containers/Threads";

type Props = {
    currentPath: string;
}

export default class Layout extends React.Component<Props, {}> {
    render() {
        return (
            <div className="full-height">
                <NavMenu currentPath={this.props.currentPath} />
                <Container id="main-container">
                    <Route path="/home" component={Home} />
                    <Route path="/editor/:id?" component={Editor} />
                    <Route path="/threads" component={Threads} />
                </Container>
            </div>
        );
    }
}
