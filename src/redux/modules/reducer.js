import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import auth from './auth';
import loader from './loader';

const appReducer = combineReducers({
    routing: routerReducer,
    reduxAsyncConnect,
    auth,
    loader,
});

const rootReducer = (state, action) => {

    return appReducer(state, action);
};

export default rootReducer;
