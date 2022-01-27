import { loginReducer } from "./loginReducer";
import { cartReducer } from "./cartReducer";
import { searchReducer } from "./searchReducer";
import { combineReducers } from "redux";
const allReducer=combineReducers({
    loginReducer,
    cartReducer,
    searchReducer
})
export default allReducer