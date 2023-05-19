import { api } from "../../../services/api";
import { setCurrency } from "../../../components/helpers/formatt/currency";
import { parseCookies } from 'nookies';
import { cleanProductsCart } from "../../ducks/cart";
import { addBudgets, addBudgetsPerClient, removeBudget } from "../../ducks/budget";
import { turnAlert, addAlertMessage, turnLoading, turnModalGetBudgets, changeTitleAlert, addMessage } from "../../ducks/Layout";
import salesPDF from "../../../reports/sales";

import { valueDecrescidFromPercent } from '../../../components/helpers/functions/percent';


export const addBudget = (budget, cleanForm) => {
    const { 'sysvendas.id': user } = parseCookies();
    return (dispatch) => {
        dispatch(turnLoading());

        budget = {
            id_user: user,
            id_client: budget.id_client,
            total_sale: setCurrency(budget.total_sale),
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
                salesPDF(...res.data.budget)
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};

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
        // console.log(JSON.stringify(sale))
        
        sale = {
            ...sale,
            id_user: user,
            check: setCurrency(sale.check),
            card: setCurrency(sale.card),
            cash: setCurrency(sale.cash),
            pay_value: setCurrency(sale.pay_value),
            total_sale: setCurrency(sale.total_sale),
            discount: setCurrency(sale.total_sale) - (setCurrency(valueDecrescidFromPercent(sale.total_sale, sale.discount)) / 100)
        };
        // console.log("Valor tratado e" + JSON.stringify({...sale}))

        api.post('/sales/changeBudgetToSale', sale)
            .then((res) =>
            (   
                dispatch(removeBudget(sale)),
                dispatch(addMessage(`Venda realizada com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                cleanForm(),
                salesPDF(...res.data.sale)
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
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