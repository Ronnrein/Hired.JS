import * as React from "react";
import { Container, Grid, Segment, Form, Button, Header, Input, Divider, Image } from "semantic-ui-react";
import { Message } from "../store/App";
import StatusMessage from "./shared/StatusMessage";

type Props = {
    message?: Message;
    isLoading: boolean;
    isPasswordRequired: boolean;
    onPlayClick: Function;
    onLoginClick: Function;
}

class Login extends React.Component<Props, {}> {
    state = {
        username: "",
        password: ""
    };

    render() {
        return (
            <Container id="login">
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={5} />
                        <Grid.Column width={6}>
                            <Form as={Segment} loading={this.props.isLoading}>
                                <Image src="/images/logo.png" fluid />
                                <Divider section horizontal>New game</Divider>
                                <Form.Field>
                                    <Button size="huge" fluid positive onClick={() => this.props.onPlayClick()}>Play!</Button>
                                </Form.Field>
                                <Divider section horizontal>Load profile</Divider>
                                {this.props.message &&
                                    <StatusMessage message={this.props.message} />
                                }
                                <Form.Field>
                                    <Input
                                        type="text"
                                        placeholder="Username"
                                        icon="user"
                                        iconPosition="left"
                                        action
                                        onChange={(e: any) => this.setState({ username: e.target.value })}
                                    />
                                </Form.Field>
                                {this.props.isPasswordRequired &&
                                    <Form.Field>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            icon="key"
                                            iconPosition="left"
                                            action
                                            onChange={(e: any) => this.setState({ password: e.target.value })}
                                        />
                                    </Form.Field>
                                }
                                <Button primary fluid onClick={() => this.props.onLoginClick(this.state.username, this.state.password)} icon="sign in" content="Load" />
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={5} />
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default Login;
