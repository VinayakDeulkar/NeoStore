
import * as Actions from '../actions/getAllProductAction'
const initialState = { product: '' ,success:false}
export const getAllProductReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.GetProductALLData_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                product:actions.payload
            };
        }
        case Actions.GetProductALLData_FAILED:
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