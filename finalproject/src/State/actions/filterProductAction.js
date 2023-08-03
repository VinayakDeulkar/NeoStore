import { FILTERPRODUCT } from "../../config/filterProductService"
export const FilterProductS_SUCCESS = 'FilterProductS_SUCCESS';
export const FilterProductS_FAILED = 'FilterProductS_FAILED'
export function FilterProductS(data) {
    return (dispatch) => {
        return FILTERPRODUCT(data).then(res => {
            dispatch({
                type: FilterProductS_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: FilterProductS_FAILED,
                    payload: error
                });
            });
    }
}