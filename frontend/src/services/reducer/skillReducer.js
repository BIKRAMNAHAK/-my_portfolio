const initialState = {
    skills: [],
}

const skillReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MY_SKILLS':
            return {
                ...state,
                skills: action.payload
            }
        default:
            return state
    }
}

export default skillReducer
