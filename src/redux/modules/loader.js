const UPDATE = 'expensetracker/loader/UPDATE';

const initialState = {
    show: false
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case UPDATE:
            return {
                ...state,
                show: action.status,
            };
        default:
            return state;
    }
}

export function updateLoader(status) {
    return {
        type: UPDATE,
        status,
    };
}
