import { api } from "../../../services/api";
import { parseCookies } from 'nookies';
import { cleanProductsCart } from "../../ducks/cart";
import { addBudgets, addBudgetsPerClient, removeBudget } from "../../ducks/budget";
import { turnAlert, addAlertMessage, turnLoading, turnModalGetBudgets, changeTitleAlert, addMessage } from "../../ducks/Layout";
import salePDF from "../../../reports/sale";

import { valueDecrescidFromPercent } from '../../../components/helpers/functions/percent';
import Router from "next/router";
import { setCurrency } from "../../../components/helpers/formatt/currency";


export const addBudget = (budget, cleanForm) => {
    const { 'sysvendas.id': user } = parseCookies();
    return (dispatch) => {
        dispatch(turnLoading());

        budget = {
            id_seller: budget.id_user ? budget.id_user : null,
            id_user: user,
            id_client: budget.id_client,
            total_sale: budget.total_sale,
            obs: budget.obs
        };

        api.post('/budgets', budget)
            .then((res) =>
            (
                dispatch(addMessage(`Orçamento gravado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                dispatch(cleanProductsCart()),
                cleanForm(),
                salePDF(...res.data.budget)
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};

export const sendBudgetToCart = (budget) => {
    const { 'sysvendas.id': user } = parseCookies();
    // console.log(JSON.stringify(budget));
    return (dispatch) => {
        dispatch(turnLoading());

        api.put(`/budgets/sendBudgetToCart/${budget.id}/${user}`, budget)
            .then((res) =>
            (
                dispatch(removeBudget(budget)),
                dispatch(addMessage(`Orçamento enviado ao carrinho com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                Router.push('/pdv')
            ))
            .catch((error) => {
                    dispatch(addAlertMessage(error.message ? `Error - ${error.response.data.message}` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error ? error.response : 'Retorno de erro desconhecido';
            })
    };

}

export const getAllBudgets = () => {
    const config = {
        transformResponse: [function (data) {

            const payload = JSON.parse(data).map(budget => {
                return {
                    ...budget,
                    "total_sale": budget.total_sale
                }
            })
            return payload;
        }]
    }

    return (dispatch) => {
        dispatch(turnLoading());

        api
            .get('/budgets', config)
            .then((res) => {
                dispatch(addBudgets(res.data));
                dispatch(turnLoading());
            })
            .catch(() => { dispatch(turnLoading()) })
    }
}

export const getAllBudgetsPerClient = (client) => {
    const config = {
        transformResponse: [function (data) {

            const payload = JSON.parse(data).map(budget => {
                return {
                    ...budget,
                    "total_sale": budget.total_sale,
                    "created_at": budget.created_at
                }
            })
            return payload;
        }]
    }

    return (dispatch) => {
        dispatch(turnLoading());

        api
            .get(`/budgets/budgetsPerClient/${client.id}`, config)
            .then((res) => {
                dispatch(addBudgetsPerClient(res.data));
                dispatch(turnModalGetBudgets());
                dispatch(turnLoading());
            })
            .catch(() => { dispatch(turnLoading()) })
    }
}

export const changeBudgetToSale = (sale, cleanForm) => {
    const { 'sysvendas.id': user } = parseCookies();
    return (dispatch) => {
        dispatch(turnLoading());
        sale = {
            id_seller: sale.id_user ? sale.id_user : null,
            ...sale,
            id_user: user,
            total_sale: setCurrency(sale.total_sale),
            pay_value: setCurrency(sale.pay_value),
            cash: setCurrency(sale.cash),
            card: setCurrency(sale.card),
            check: setCurrency(sale.check),
            discount: setCurrency(sale.total_sale) - valueDecrescidFromPercent(sale.total_sale, sale.discount)
        };
        console.log(`Venda é ${JSON.stringify(sale)}`)

        // api.post('/sales/changeBudgetToSale', sale)
        //     .then((res) =>
        //     (
        //         dispatch(removeBudget(sale)),
        //         dispatch(addMessage(`Venda realizada com sucesso!`)),
        //         dispatch(turnAlert()),
        //         dispatch(turnLoading()),
        //         cleanForm(),
        //         salePDF(...res.data.sale)
        //     ))
        //     .catch((error) => {
        //         dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
        //         dispatch(turnLoading());
        //         return error.response ? error.response.data : 'erro desconhecido';
        //     })

        dispatch(turnLoading());
    };
};

// export const toPayBudgetsFetch = (form, cleanForm) => {
//     return (dispatch) => {
//         dispatch(turnLoading());

//         form = {
//             ...form,
//             cash: setCurrency(form.cash),
//         };

//         api.post(`/budgets/pay`, form)
//             .then((res) =>
//             (
//                 dispatch(changeTitleAlert(res.data)),
//                 dispatch(getAllClients()),
//                 dispatch(turnAlert()),
//                 dispatch(turnLoading()),
//                 cleanForm()
//             ))
//             .catch((error) => {
//                 dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
//                 dispatch(turnLoading());
//                 return error.response ? error.response.data : 'erro desconhecido';
//             })
//     };
// }