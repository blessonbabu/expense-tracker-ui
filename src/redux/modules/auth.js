import { generateURL, demoUrl, appRoutes, uiEndpoint } from '../../config';

const LOAD = 'expensetracker/auth/LOAD';
const LOAD_SUCCESS = 'expensetracker/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'expensetracker/auth/LOAD_FAIL';

const SHOW_NOTIFICATION = 'expensetracker/app/SHOW_NOTIFICATION';
const HIDE_NOTIFICATION = 'expensetracker/app/HIDE_NOTIFICATION';

const LOGOUT = 'expensetracker/auth/LOGOUT';

const initialState = {
    loaded: false,
    notification: { show: false },
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOAD:
            return {
                ...state,
                loading: true,
            };
        case LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                user: action.result,
            };
        case LOAD_FAIL:
            return {
                ...state,
                loading: false,
                loaded: false,
                error: action.error,
            };
        case SHOW_NOTIFICATION:
            return {
                ...state,
                notification: {
                    show: true,
                    type: action.messagetype,
                    message: action.message,
                },
            };
        case HIDE_NOTIFICATION:
            return {
                ...state,
                notification: { show: false },
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                loginError: action.error
            };
        default:
            return state;
    }
}

export function isLoaded(globalState) {
    return globalState.auth && globalState.auth.loaded;
}

export function logout(message) {
    localStorage.clear();
    // document.location.assign(`${appRoutes.logout.link}${uiEndpoint}`);
    return { type: LOGOUT, error: message };
}

export function load() {
    return dispatch => dispatch({
        types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
        promise: () => new Promise((resolve, reject) => {
            const user = localStorage.getItem('user');
            const userexpiry = localStorage.getItem('userexpiry');
            if (user) {
                const exp = parseInt(userexpiry, 10);
                console.log('exp ', exp);
                console.log('Date now', Date.now);

                if (exp > Date.now()) {
                    console.log('json parse ', JSON.parse(user));
                    resolve(JSON.parse(user));
                } else {
                    reject({ statusCode: 401 });
                }
            } else {
                reject({ statusCode: 401 });
            }
        }),
    });
}

export function showMessage(messagetype, message) {
    return (dispatch) => {
        setTimeout(() => dispatch({ type: HIDE_NOTIFICATION }), 5000);

        return dispatch({ type: SHOW_NOTIFICATION, messagetype, message });
    };
}