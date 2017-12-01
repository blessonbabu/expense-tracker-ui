import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import auth from './auth';

const appReducer = combineReducers({
    routing: routerReducer,
    reduxAsyncConnect,
    auth,
});

const rootReducer = (state, action) => {

    return appReducer(state, action);
};

export default rootReducer;
