
import * as Actions from '../actions/filterProductAction'
const initialState = { FilterProduct: '' ,success:false}
export const FilterproductReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.FilterProductS_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                FilterProduct:actions.payload
            };
        }
        case Actions.FilterProductS_FAILED:
        {
            return {
                success: false,
                FilterProduct  : actions.payload
            };
        }
        default:
        {
            return state
        }
    }
}