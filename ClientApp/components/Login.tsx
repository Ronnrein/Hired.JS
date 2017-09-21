import * as React from "react";
import { Container, Grid, Segment, Form, Button, Header, Input, Divider, Message } from "semantic-ui-react";

export interface LoginFields {
    userName: string;
}

type Props = {
    onPlayClick: Function;
    onLoginClick: Function;
    message?: string;
}

class Login extends React.Component<Props, {}> {
    state = {
        login: {
            userName: ""
        }
    };

    onUsernameChange(value: string) {
        this.setState({
            login: Object.assign({}, this.state.login, {
                userName: value
            })
        });
    }

    render() {
        return (
            <Container id="login">
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={5} />
                        <Grid.Column width={6}>
                            <Form as={Segment}>
                                <Header>Logo goes here</Header>
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
                                    <Input type="text" placeholder="Username" action>
                                        <input onChange={(e: any) => this.onUsernameChange(e.target.value)} />
                                        <Button primary onClick={() => this.props.onLoginClick(this.state.login)}>Load</Button>
                                    </Input> 
                                </Form.Field>
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
