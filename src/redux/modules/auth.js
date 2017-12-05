import { generateURL, demoUrl, appRoutes, uiEndpoint } from '../../config';
import { updateLoader } from './loader';

const LOAD = 'expensetracker/auth/LOAD';
const LOAD_SUCCESS = 'expensetracker/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'expensetracker/auth/LOAD_FAIL';

const LOAD_USER = 'expensetracker/auth/LOAD_USER';
const LOAD_USER_SUCCESS = 'expensetracker/auth/LOAD_USER_SUCCESS';
const LOAD_USER_FAIL = 'expensetracker/auth/LOAD_FAIL';
const FETCH_USER_DETAILS_API_KEY = 'getUserDetails';

const LOGIN = 'expensetracker/auth/LOGIN';
const LOGIN_SUCCESS = 'expensetracker/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'expensetracker/auth/LOGIN_FAIL';

const USER_LOGIN = 'expensetracker/auth/USER_LOGIN';
const USER_LOGIN_SUCCESS = 'expensetracker/auth/USER_LOGIN_SUCCESS';
const USER_LOGIN_FAIL = 'expensetracker/auth/USER_LOGIN_FAIL';
const USER_LOGIN_API_KEY = 'userLoginDetails';

const SHOW_NOTIFICATION = 'expensetracker/app/SHOW_NOTIFICATION';
const HIDE_NOTIFICATION = 'expensetracker/app/HIDE_NOTIFICATION';

export const LOGOUT = 'expensetracker/auth/LOGOUT';

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
        case LOGIN:
            return {
                ...state,
                loginError: null,
                loggingIn: true,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggingIn: false,
            };
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                user: { ...action.result.data, token: localStorage.getItem('useraccess')},
            };
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                user: { ...action.result.user, token: action.result.access_token },
            };
        case LOGIN_FAIL:
            return {
                ...state,
                loggingIn: false,
                user: null,
                loginError: action.error,
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
const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");
    console.log('entered cookies delete ', cookies);

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
export function logout(message) {
    console.log('njaanum');
    localStorage.clear();
    document.location.assign(`${appRoutes.logout.link}${uiEndpoint}`);
    return { type: LOGOUT, error: message };
}

export function loadUser(userId) {
    return dispatch => dispatch({
        types: [LOAD_USER,LOAD_USER_SUCCESS,LOAD_USER_FAIL],
        promise: client => client.get(generateURL(FETCH_USER_DETAILS_API_KEY).replace('%d',userId)).then((result) => {
            localStorage.setItem('user', JSON.stringify(result.data));
            return result;
        })
            .then(() => window.location.assign("/clients"))
            .catch((err) => {
                dispatch(updateLoader(false));
                throw err;
            }),
    });
}

export function load() {
    return dispatch => dispatch({
        types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
        promise: () => new Promise((resolve, reject) => {
            const user = localStorage.getItem('user');
            const userexpiry = localStorage.getItem('userexpiry');
            if (user) {
                const exp = parseInt(userexpiry, 10);
                if (exp > Date.now()) {
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