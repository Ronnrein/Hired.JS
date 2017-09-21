import "./css/site.css";
import "../semantic/dist/semantic.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { createBrowserHistory } from "history";
import configureStore from "./configureStore";
import { Route } from "react-router-dom";
import { ApplicationState }  from "./store";
import App from "./containers/App";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href")!;
const history = createBrowserHistory({ basename: baseUrl });

const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore(history, initialState);

function renderApp() {
    ReactDOM.render(
        <AppContainer>
            <Provider store={ store }>
                <ConnectedRouter history={history}>
                    <Route path="/" component={App} />
                </ConnectedRouter>
            </Provider>
        </AppContainer>,
        document.getElementById("react-app")
    );
}

renderApp();

if (module.hot) {
    module.hot.accept();
}
