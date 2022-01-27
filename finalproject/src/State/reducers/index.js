import { loginReducer } from "./loginReducer";
import { cartReducer } from "./cartReducer";
import { searchReducer } from "./searchReducer";
import { combineReducers } from "redux";
const allReducer=combineReducers({
    Login:loginReducer,
    cart:cartReducer,
    searchitem:searchReducer
})
export default allReducer