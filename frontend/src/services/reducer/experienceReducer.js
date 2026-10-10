const initialState = {
    experiences: [],
}

const experienceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MY_EXPERIENCES':
            return {
                ...state,
                experiences: action.payload
            }
        default:
            return state
    }
}

export default experienceReducer
