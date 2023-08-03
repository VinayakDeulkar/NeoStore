import { ProfilePicUpdate } from "../../config/myAccountService"

export const Update_profile_pic_SUCCESS = 'Update_profile_pic_SUCCESS';
export const Update_profile_pic_FAILED = 'Update_profile_pic_FAILED'
export function Update_profile_pic(data) {
    return (dispatch) => {
        return ProfilePicUpdate(data).then(res => {
            dispatch({
                type: Update_profile_pic_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: Update_profile_pic_FAILED,
                    payload: error
                });
            });
    }
}