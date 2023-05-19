import { api } from "../../../services/api";
import { getCurrency, setCurrency } from "../../../components/helpers/formatt/currency";
import { addProductsCart, addProductCart, removeProductCart } from "../../ducks/cart";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";
import { parseCookies } from 'nookies';


export const getListProductsCart = () => {
    const { 'sysvendas.id': user } = parseCookies();


    const config = {
        transformResponse: [function(data) {
            const payload = JSON.parse(data).map(d => {
                return {
                    ...d,
                    product: {
                        ...d.product,
                        reason: getCurrency(d.product.reason),
                    }
                }
            })
            return payload;
        }]
    }

    return (dispatch) => {
        dispatch(turnLoading())
        api
            .get(`/cart/${user}`, config)
            .then((res) => {                
                dispatch(addProductsCart(res.data));
                dispatch(turnLoading());
            })
            .catch(() => { dispatch(turnLoading()) })
    }
}

export const addProductCartFetch = (cart, cleanForm) => {
    const { 'sysvendas.id': user } = parseCookies();
    return (dispatch) => {
        dispatch(turnLoading());

        const prod = {
            id_user: user,
            qtd: setCurrency(cart.qtd),
            item_value: setCurrency(cart.product.sale_value),
            id_product: cart.product ? cart.product.id : '',
            id_product_stock: cart.product ? cart.product.id_product_stock : '',
            reason: cart.product ? cart.product.reason : 1
        };
        
        api.post('/cart', prod)
            .then((res) =>
            (

                res = {
                    ...res.data.cart,
                    product: {
                        id: cart.product.id,
                        name: cart.product.name,
                        bar_code: cart.product.bar_code,
                        item_value: setCurrency(cart.product.item_value),
                        reason: cart.product.reason,
                        id_product_stock: cart.product.id_product_stock
                        // id_unity: cart.product.id_unity,
                        // id_category: cart.product.id_category,
                        // stock: setCurrency(cart.product.stock),
                        // cost_value: setCurrency(cart.product.cost_value),
                        // active: cart.product.active,
                    }
                },
                
                cleanForm(),
                dispatch(addProductCart(res)),
                dispatch(addMessage(`O produto ${res.product.name} foi adicionado ao carrinho!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading())

            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};

export const editProductCartFetch = (cart, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());
       
        api.put(`/cart/${cart.id}`, cart)
            .then((res) =>
            (
                res = {
                    ...res.data.cart,
                    product: {
                        id: cart.product.id,
                        name: cart.product.name,
                        bar_code: cart.product.bar_code,
                        item_value: res.data.cart.item_value,
                        obs: cart.product.obs,
                        reason: cart.product.reason,
                        id_product_stock: cart.product.id_product_stock
                        // id_unity: cart.product.id_unity,
                        // id_category: cart.product.id_category,
                        // stock: setCurrency(cart.product.stock),
                        // qtd: res.data.cart.qtd,
                        // cost_value: setCurrency(cart.product.cost_value),
                        // active: cart.product.active,
                    }
                },
                cleanForm(),
                dispatch(addProductCart(res)),
                dispatch(addMessage(`O produto ${res.product.name} foi atualizado!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading())

            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};

export const deleteProductFromCart = (product) => {
    return (dispatch) => {
        dispatch(turnLoading());

        api.delete(`/cart/${product.id}`)
            .then((res) =>
            (
                dispatch(removeProductCart(product)),
                dispatch(addMessage(`O produto ${product.product.name} foi retirado do carrinho com sucesso!`)),
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