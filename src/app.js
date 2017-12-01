/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { ReduxAsyncConnect } from 'redux-connect';
import { syncHistoryWithStore } from 'react-router-redux';
import { useScroll } from 'react-router-scroll';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import getRoutes from './routes';

const client = new ApiClient();
const dest = document.getElementById('app-container');
const store = createStore(browserHistory, client, window.__data);
const history = syncHistoryWithStore(browserHistory, store);

const component = (
    <Router
        render={props =>
            <ReduxAsyncConnect
                {...props}
                helpers={{ client }}
                filter={item => !item.deferred}
                render={applyRouterMiddleware(useScroll())}
            />
        }
        history={history}
    >
        {getRoutes(store)}
    </Router>
);

ReactDOM.render(
    <Provider store={store} key="provider">
        {component}
    </Provider>,
    dest
);

if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger

    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
        console.error( // eslint-disable-line no-console
            'Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.'
        );
    }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
    const DevTools = require('./containers/DevTools/DevTools'); // eslint-disable-line global-require

    ReactDOM.render(
        <Provider store={store} key="provider">
            <div>
                {component}
                <DevTools />
            </div>
        </Provider>,
        dest
    );
}