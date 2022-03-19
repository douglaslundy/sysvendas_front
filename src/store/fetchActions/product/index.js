import api from "../../../services/api";
import { inactiveProduct, addProduct, editProduct, addProducts } from "../../ducks/products";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";

export const getAllProducts = () => {
    return (dispatch) => {
        api
            .get('/products')
            .then((res) => {
                dispatch(turnLoading())
                dispatch(addProducts(res.data))
            })
            .catch(console.log)
            .then(dispatch(turnLoading()))
    }
}

export const addProductFetch = (product) => {
    return (dispatch) => {
        console.log(" em fetch actions  entrou na rota add Producte ");
        api.post('/products', product)
            .then((res) =>
            (
                dispatch(turnLoading()),
                dispatch(addProduct(res.data.product)),
                dispatch(addMessage(`O produto ${res.data.product.name} foi adicionado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
            then(dispatch(turnLoading()))
    };
};


export const editProductFetch = (product) => {
    return (dispatch) => {
        
        console.log(" em fetch actions entrou na rota Editar Producte " + product.id);
        api.put(`/products/${product.id}`, product)
            .then((res) =>
            (
                dispatch(turnLoading()),
                dispatch(editProduct(res.data.product)),
                dispatch(addMessage(`O produto ${res.data.product.name} foi atualizado com sucesso!`)),      
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
            .then(dispatch(turnLoading()))
    };
}

export const inactiveProductFetch = (product) => {
    return (dispatch) => {
        api.delete(`/products/${product.id}`)
            .then((res) =>
            (
                dispatch(turnLoading()),
                dispatch(inactiveProduct(product)),
                dispatch(addMessage(`O produto ${product.name} foi inativado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
                return error;
            })
            .then(dispatch(turnLoading()))
    }
}