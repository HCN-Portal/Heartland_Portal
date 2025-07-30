import appReducer from "./reducers/appReducer"
import authReducer from "./reducers/authReducer"
import  userReducer  from "./reducers/userReducer"
const rootReducers = {
    application: appReducer,
    auth: authReducer,
    user: userReducer
}

export default rootReducers