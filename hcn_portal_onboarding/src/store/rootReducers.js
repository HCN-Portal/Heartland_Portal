import appReducer from "./reducers/appReducer"
import authReducer from "./reducers/authReducer"
import  userReducer  from "./reducers/userReducer"
import projectReducer from "./reducers/projectReducer"

const rootReducers = {
    application: appReducer,
    auth: authReducer,
    user: userReducer,
    project: projectReducer
}

export default rootReducers