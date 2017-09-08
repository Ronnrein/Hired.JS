import * as React from "react";
import { Container } from "semantic-ui-react";
import { NavMenu } from "./NavMenu";

export class Layout extends React.Component<{}, {}> {
    public render() {
        return (
            <div>
                <NavMenu />
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
