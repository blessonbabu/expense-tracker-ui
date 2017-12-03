/**
 * Library dependency
 */
import React from 'react';
import { Route } from 'react-router';

/**
 * App dependency
 */
import { access, appRoutes } from 'config';

/**
 * Set of container components used for configuring routes
 */
import App from 'containers/App/App';
import AppProfile from 'containers/App/AppProfile';

import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';

/**
 * Validates whether the user have access to current route.
 */
const hasAccess = (collection, path, restrictions) => {
    const routeKeys = Object.keys(collection);
    let accessible = true;

    if (restrictions.length) {
        routeKeys.forEach((key) => {
            const { link, children } = collection[key];

            if (path.indexOf(link) !== -1) {
                if (restrictions.indexOf(key) !== -1) {
                    accessible = false;
                } else if (children) {
                    accessible = accessible && hasAccess(children, path, restrictions);
                }
            }
        });
    }

    return accessible;
};

export default (store) => {

    /**
     * Ensurses the routes are server to the logged in user who has access
     */
    const requireLogin = (nextState, replace, cb) => {
        function checkAuth() {
            const { auth: { user } } = store.getState();
            const nextPath = nextState.location.pathname;

            console.log('user is ', user);
            console.log('nextPath', nextPath);

            if (user && nextPath === '/') {
                const { root } = access[user.role];
                console.log('root is ', root);

                replace(root);
            } else if (!user && nextPath !== '/') {
                store.dispatch(logout());
            }
            cb();
        }
        if (!isAuthLoaded(store.getState())) {
            store.dispatch(loadAuth()).then(checkAuth, checkAuth);
        } else {
            checkAuth();
        }
    };

    /**
     * Validates whether the user have access to current route.
     */
    const ensureAccess = (nextState, replace, cb) => {
        console.log('entered ensure access');
        const { auth: { user } } = store.getState();
        const nextPath = nextState.location.pathname;
        console.log('user role', user);

        if (user && nextPath !== '/') {
            const { restrictions = [], root } = access[user.role];

            if (!hasAccess(appRoutes, nextPath, restrictions)) {
                replace(root);
            }
        }
        cb();
    };

    /**
     * Please keep routes in alphabetical order
     */
    return (
        <Route path="/" component={App} onEnter={requireLogin} >
            <Route path="profile" component={AppProfile} onEnter={ensureAccess} />
        </Route>
    );
};
