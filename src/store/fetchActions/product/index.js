import api from "../../../services/api";
import { getCurrency, setCurrency } from "../../../components/helpers/formatt/currency";
import { getId } from '../../../components/helpers/formatt/getIdFromSelect';
import { inactiveProduct, addProduct, editProduct, addProducts } from "../../ducks/products";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";

export const getAllProducts = () => {

    const config = {
        transformResponse: [function (data) {

            const payload = JSON.parse(data).map(d => {
                return {
                    ...d,
                    "cost_value": getCurrency(d.cost_value),
                    "sale_value": getCurrency(d.sale_value),
                }
            })
            return payload;
        }]
    }


    return (dispatch) => {
        dispatch(turnLoading())
        api
            .get('/products', config)
            .then((res) => {
                dispatch(addProducts(res.data));
                dispatch(turnLoading());
            })
            .catch(() => { dispatch(turnLoading()) })
    }
}

export const addProductFetch = (product, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());

        product = {
            ...product,
            cost_value: setCurrency(product.cost_value),
            sale_value: setCurrency(product.sale_value)
            // id_category: getId(product.id_category)
        };

        api.post('/products', product)
            .then((res) =>
            (
                product = {
                    ...res.data.product,
                    cost_value: getCurrency(res.data.product.cost_value),
                    sale_value: getCurrency(res.data.product.sale_value)
                },

                dispatch(addProduct(product)),
                dispatch(addMessage(`O produto ${product.name} foi adicionado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                cleanForm()
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                dispatch(turnLoading())
                return error.response.data
            })
    };
};


export const editProductFetch = (product, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading())

        product = {
            ...product,
            cost_value: setCurrency(product.cost_value),
            sale_value: setCurrency(product.sale_value)
            // id_category: getId(product.id_category)
        };


        api.put(`/products/${product.id}`, product)
            .then((res) =>
            (
                product = {
                    ...res.data.product,
                    cost_value: getCurrency(res.data.product.cost_value),
                    sale_value: getCurrency(res.data.product.sale_value)
                },

                dispatch(editProduct(product)),
                dispatch(addMessage(`O produto ${product.name} foi atualizado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()), 
                cleanForm()
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