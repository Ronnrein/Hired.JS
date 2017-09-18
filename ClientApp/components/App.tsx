import * as React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { NavMenu } from "./NavMenu";
import Home from "../components/Home";
import Editor from "../components/Editor";
import AssignmentList from "../components/AssignmentList";

export class App extends React.Component<{}, {}> {
    public render() {
        return (
            <div>
                <NavMenu />
                <Container>
                    <Route exact path="/" component={Home} />
                    <Route path="/editor/:id?" component={Editor} />
                    <Route path="/assignments" component={AssignmentList} />
                </Container>
            </div>
        );
    }
}
