import api from "../../../services/api";
import { inactiveProduct, addProduct, editProduct, addProducts } from "../../ducks/products";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";

export const getAllProducts = () => {
    return (dispatch) => {
        dispatch(turnLoading())
        api
            .get('/products')
            .then((res) => {
                dispatch(addProducts(res.data))
                dispatch(turnLoading())
            })
            .catch(() => {
                dispatch(turnLoading())
            }) 
    }
}

export const addProductFetch = (product) => {
    return (dispatch) => {
        dispatch(turnLoading())

        api.post('/products', product)
            .then((res) =>
            (
                dispatch(addProduct(res.data.product)),
                dispatch(addMessage(`O produto ${res.data.product.name} foi adicionado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                dispatch(turnLoading())
                return error.response.data
            })
    };
};


export const editProductFetch = (product) => {
    return (dispatch) => {
        dispatch(turnLoading())

        api.put(`/products/${product.id}`, product)
            .then((res) =>
            (
                dispatch(editProduct(res.data.product)),
                dispatch(addMessage(`O produto ${res.data.product.name} foi atualizado com sucesso!`)),      
                dispatch(turnAlert()),
                dispatch(turnLoading())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                dispatch(turnLoading())
                return error.response.data
            })
    };
}

export const inactiveProductFetch = (product) => {
    return (dispatch) => {
        dispatch(turnLoading());

        api.delete(`/products/${product.id}`)
            .then((res) =>
            (
                dispatch(inactiveProduct(product)),
                dispatch(addMessage(`O produto ${product.name} foi inativado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
                dispatch(turnLoading());
                return error;
            })
    }
}