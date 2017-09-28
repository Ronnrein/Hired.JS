import * as React from "react";
import { Container, Grid, Segment, Form, Button, Header, Input, Divider, Message, Image } from "semantic-ui-react";

type Props = {
    message?: string;
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
                                {this.props.message !== undefined &&
                                    <Message
                                        size="tiny"
                                        icon="privacy"
                                        header="Could not load"
                                        content={this.props.message}
                                    />
                                }
                                <Form.Field>
                                    <Input
                                        type="text"
                                        placeholder="Username"
                                        action
                                        onChange={(e: any) => this.setState({ username: e.target.value })}
                                    />
                                </Form.Field>
                                {this.props.isPasswordRequired &&
                                    <Form.Field>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            action
                                            onChange={(e: any) => this.setState({ password: e.target.value })}
                                        />
                                    </Form.Field>
                                }
                                <Button primary fluid onClick={() => this.props.onLoginClick(this.state.username, this.state.password)}>Load</Button>
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
