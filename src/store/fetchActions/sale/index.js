import { api } from "../../../services/api";
import { getCurrency, setCurrency } from "../../../components/helpers/formatt/currency";
// import { inactiveProduct, addProduct, editProduct, addProducts } from "../../ducks/products";
import { turnLoading, turnAlert, addMessage, addAlertMessage, changeTitleAlert } from "../../ducks/Layout";
import { parseCookies } from 'nookies';
import { cleanProductsCart } from "../../ducks/cart";

// export const getAllProducts = () => {
//     const config = {
//         transformResponse: [function (data) {
//             const payload = JSON.parse(data).map(d => {
//                 return {
//                     ...d,
//                     cost_value: getCurrency(d.cost_value),
//                     sale_value: getCurrency(d.sale_value),
//                     reason: getCurrency(d.reason),
//                     stock: getCurrency(d.stock !== null ? d.stock.stock : 0)
//                 }
//             })
//             return payload;
//         }]
//     }

//     return (dispatch) => {
//         dispatch(turnLoading())
//         api 
//         .get('/products', config)
//             .then((res) => {            
//                 dispatch(addProducts(res.data));
//                 dispatch(turnLoading());
//             })
//             .catch(() => { dispatch(turnLoading()) })
//     }
// }

export const addSale = (sale, cleanForm) => {
    const { 'sysvendas.id': user } = parseCookies();
    return (dispatch) => {
        dispatch(turnLoading());

        sale = {
            ...sale,
            id_user: user,
            check: setCurrency(sale.check),
            card: setCurrency(sale.card),
            cash: setCurrency(sale.cash),
            pay_value: setCurrency(sale.pay_value),
            total_sale: setCurrency(sale.total_sale)
        };

        api.post('/sales', sale)
            .then((res) =>
            (
                // sale = {
                //     ...res.data,
                //     check: getCurrency(res.datacheck),
                //     card: getCurrency(res.data.card),
                //     cash: getCurrency(res.data.cash),
                //     pay_value: getCurrency(res.data.pay_value),
                //     total_sale: getCurrency(res.data.total_sale)
                // },

                // // dispatch(addSale(sale)),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                dispatch(cleanProductsCart()),
                cleanForm()
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                // dispatch(changeTitleAlert(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                // dispatch(turnAlert()),
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};


