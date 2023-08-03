
import { GetPopularProduct } from "../../config/productService";

export const GetProductData_SUCCESS = 'GetProductData_SUCCESS';
export const GetProductData_FAILED = 'GetProductData_FAILED'
export function GetProductData(data) {
    return (dispatch) => {
        return GetPopularProduct(data).then(res => {
            dispatch({
                type: GetProductData_SUCCESS,
                payload: res.data
            })
        })
            .catch(error => {
                return dispatch({
                    type: GetProductData_FAILED,
                    payload: error
                });
            });
    }
}