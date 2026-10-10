const initialState = {
    resumes: [],
}

const resumeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MY_RESUMES':
            return {
                ...state,
                resumes: action.payload
            }
        default:
            return state
    }
}

export default resumeReducer
