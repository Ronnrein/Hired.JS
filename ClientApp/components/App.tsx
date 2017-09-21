import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { Container, Dimmer, Loader } from "semantic-ui-react";
import { NavMenu } from "./NavMenu";
import Login, { LoginFields } from "./Login";
import * as AppStore from "../store/App";
import { actionCreators as assignmentsActions } from "../store/Assignments";
import Home from "../components/Home";
import Editor from "../containers/Editor";
import Assignments from "../containers/Assignments";

type AppProps =
    AppStore.AppState
    & typeof AppStore.actionCreators
    & typeof assignmentsActions
    & RouteComponentProps<{}>;

class App extends React.Component<AppProps, {}> {

    componentDidMount() {
        this.props.fetchUser();
    }

    componentWillReceiveProps(next: AppProps) {
        if(this.props.user === undefined && next.user !== undefined) {
            this.props.requestAssignments();
        }
    }

    onPlayClick() {
        this.props.register();
    }

    onLoginClick(login: LoginFields) {
        this.props.login(login);
    }

    render() {
        let content = this.props.user === undefined ? this.renderLogin() : this.renderContent();
        return (
            <div>
                <Dimmer active={this.props.loading}>
                    <Loader size="big">{this.props.loadingText}</Loader>
                </Dimmer>
                {content}
            </div>
        );
    }

    renderLogin() {
        return (<Login
            onPlayClick={() => this.onPlayClick()}
            onLoginClick={(login: LoginFields) => this.onLoginClick(login)}
            message={this.props.message}
        />);
    }

    renderContent() {
        return(
            <div>
                <NavMenu/>
                <Container>
                    <Route path="/home" component={Home}/>
                    <Route path="/editor/:id?" component={Editor}/>
                    <Route path="/assignments" component={Assignments}/>
                </Container>
            </div>
        );
    }

}

export default connect(
    (state: ApplicationState) => state.app,
    Object.assign(AppStore.actionCreators, assignmentsActions)
)(App) as typeof App;
