import { api } from "../../../services/api";
import { setCurrency } from "../../../components/helpers/formatt/currency";
import { parseCookies } from 'nookies';
import { cleanProductsCart } from "../../ducks/cart";
import { addBudgets, addBudgetsPerClient } from "../../ducks/budget";
import { turnAlert, addAlertMessage, turnLoading, turnModalGetBudgets, changeTitleAlert } from "../../ducks/Layout";
import { getAllClients } from "../client";
// import budgetsPDF from "../../../reports/budgets";
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