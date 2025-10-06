import appReducer from "./reducers/appReducer"
import authReducer from "./reducers/authReducer"
import  userReducer  from "./reducers/userReducer"
import projectReducer from "./reducers/projectReducer"
import projectApplicationReducer from "./reducers/projectApplicationReducer"

const rootReducers = {
    application: appReducer,
    auth: authReducer,
    users: userReducer,
    projects: projectReducer,
    projectApplications: projectApplicationReducer,
}

export default rootReducers