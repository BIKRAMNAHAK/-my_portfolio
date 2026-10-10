import { combineReducers } from "redux";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import skillReducer from "./skillReducer";
import experienceReducer from "./experienceReducer";
import messageReducer from "./messageReducer";
import resumeReducer from "./resumeReducer";

const rootReducer = combineReducers({
  my_data: authReducer,
  my_projects: projectReducer,
  my_skills: skillReducer,
  my_experiences: experienceReducer,
  my_messages: messageReducer,
  my_resumes: resumeReducer,
});

export default rootReducer;