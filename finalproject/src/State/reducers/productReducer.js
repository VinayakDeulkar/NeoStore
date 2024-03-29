
import * as Actions from '../actions/productAction'
const initialState = { product: '' ,success:false}
export const productReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.GetProductData_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                product:actions.payload
            };
        }
        case Actions.GetProductData_FAILED:
        {
            return {
                success: false,
                product  : actions.payload
            };
        }
        default:
        {
            return state
        }
    }
}