import * as React from "react";
import { Provider } from "react-redux";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { replace } from "react-router-redux";
import { createMemoryHistory } from "history";
import { createServerRenderer, RenderResult } from "aspnet-prerendering";
import configureStore from "./configureStore";
import App from "./containers/App";
import { Route } from "react-router-dom";

export default createServerRenderer(params => {
    return new Promise<RenderResult>((resolve, reject) => {

        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1);
        const urlAfterBasename = params.url.substring(basename.length);
        const store = configureStore(createMemoryHistory());
        store.dispatch(replace(urlAfterBasename));

        const routerContext: any = {};
        const app = (
            <Provider store={ store }>
                <StaticRouter basename={ basename } context={ routerContext } location={ params.location.path }>
                    <Route exact path="/" component={App} />
                </StaticRouter>
            </Provider>
        );
        renderToString(app);

        if (routerContext.url) {
            resolve({ redirectUrl: routerContext.url });
            return;
        }
 
        params.domainTasks.then(() => {
            resolve({
                html: renderToString(app),
                globals: { initialReduxState: store.getState() }
            });
        }, reject);
    });
});
