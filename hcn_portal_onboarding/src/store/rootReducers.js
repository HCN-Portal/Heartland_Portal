import appReducer from "./reducers/appReducer"
import authReducer from "./reducers/authReducer"

const rootReducers = {
    application: appReducer,
    auth: authReducer
}

export default rootReducers