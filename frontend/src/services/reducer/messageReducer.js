const initialState = {
    messages: [],
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MY_MESSAGES':
            return {
                ...state,
                messages: action.payload
            }
        default:
            return state
    }
}

export default messageReducer
