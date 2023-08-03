
import * as Actions from '../actions/myAccountAction'
const initialState = { NewProfile: '' ,success:false}
export const myAccountReducer = (state = initialState, actions) => {
    switch ( actions.type )
    {
        case Actions.Update_profile_pic_SUCCESS:
        {
            return {
                ...initialState,
                success: true,
                NewProfile:actions.payload
            };
        }
        case Actions.Update_profile_pic_FAILED:
        {
            return {
                success: false,
                error  : actions.payload
            };
        }
        default:
        {
            return state
        }
    }
}