const initialState = {
    projects: [],

}

const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case  'SET_MY_PROJECTS' :
            return {
                projects: action.payload
            }
        default:
            return state
    }
}

export default projectReducer