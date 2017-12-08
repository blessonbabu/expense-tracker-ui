/**
 * Library dependency
 */
import React from 'react';
import { Route } from 'react-router';

/**
 * Set of container components used for configuring routes
 */
import App from 'containers/App/App';
import AppProfile from 'containers/App/AppProfile';
import NotFound from 'containers/NotFound/NotFound';

import { appRoutes } from 'config';

import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';

export default (store) => {

    /**
     * Ensurses the routes are server to the logged in user who has access
     */
    const requireLogin = (nextState, replace, cb) => {
        function checkAuth() {
            const { auth: { user } } = store.getState();
            const nextPath = nextState.location.pathname;
            if (user && nextPath === '/') {
                const { profile: { link } } = appRoutes;
                replace(link);
            } else if (!user && nextPath !== '/') {
                store.dispatch(logout());
            }
            cb();
        }
        if (!isAuthLoaded(store.getState())) {
            console.log('enterede not auth');
            store.dispatch(loadAuth()).then(checkAuth, checkAuth);
        } else {
            checkAuth();
        }
    };

    /**
     * Please keep routes in alphabetical order
     */
    return (
        <Route path="/" component={App} onEnter={requireLogin} >
            <Route path="profile" component={AppProfile} />
            <Route path="*" component={NotFound} status={404} />
        </Route>
    );
};
