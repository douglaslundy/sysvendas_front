import { api } from "../../../services/api";
import { addProductsCart, addProductCart, removeProductCart, cleanProductsCart } from "../../ducks/cart";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";
import { parseCookies } from 'nookies';


export const getListProductsCart = () => {
    const { 'sysvendas.id': user } = parseCookies();

    // const config = {

    //     transformResponse: [function (data) {
    //         const payload = JSON.parse(data).map(d => {
    //             return {
    //                 ...d,
    //                 product: {
    //                     ...d.product,
    //                     reason: getCurrency(d.product.reason),
    //                 }
    //             }
    //         })
    //         return payload;
    //     }]
    // }

    return (dispatch) => {
        dispatch(turnLoading())
        api
            // .get(`/cart/${user}`, config)
            .get(`/cart/${user}`)
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
            qtd: cart.qtd,
            item_value: cart.product.sale_value,
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
                        reason: cart.product.reason,
                        id_product_stock: cart.product.id_product_stock,
                        unity: cart.product.unity
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
                        id_product_stock: cart.product.id_product_stock,
                        unity: res.data.cart.product.unity
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

export const cleanCart = () => {
    
    const { 'sysvendas.id': user } = parseCookies();
    
    return (dispatch => {
        dispatch(turnLoading());

        api.delete(`/cart/clean/${user}`)
            .then((res) =>
            (
                dispatch(cleanProductsCart()),
                dispatch(addMessage('Os produtos deste carrinho foram removidos com sucesso!')),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error}`));
                dispatch(turnLoading());
                return error;
            })
    })
}