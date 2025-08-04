import appReducer from "./reducers/appReducer"
import authReducer from "./reducers/authReducer"
import projectReducer from "./reducers/projectReducer"

const rootReducers = {
    application: appReducer,
    auth: authReducer,
    project: projectReducer
}

export default rootReducers