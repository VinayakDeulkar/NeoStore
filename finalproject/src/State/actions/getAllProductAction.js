import { GetProduct } from "../../config/productService";
export const GetProductALLData_SUCCESS = 'GetProductALLData_SUCCESS';
export const GetProductALLData_FAILED = 'GetProductALLData_FAILED'
export function GetProductALLData(data) {
    return (dispatch) => {
        return GetProduct(data).then(res => {
            dispatch({
                type: GetProductALLData_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: GetProductALLData_FAILED,
                    payload: error
                });
            });
    }
}