import { api } from "../../../services/api";
import { setCurrency } from "../../../components/helpers/formatt/currency";
import { parseCookies } from 'nookies';
import { cleanProductsCart } from "../../ducks/cart";
import { addSales, addSalesPerClient } from "../../ducks/sales";
import { turnAlert, addAlertMessage, turnLoading, turnModalGetPendingSales, turnModalGetAllSales, changeTitleAlert } from "../../ducks/Layout";
import { getAllClients } from "../client";
import salesPDF from "../../../reports/sales";

import { valueDecrescidFromPercent } from '../../../components/helpers/functions/percent';


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
            total_sale: setCurrency(sale.total_sale),
            discount: setCurrency(sale.total_sale) - (setCurrency(valueDecrescidFromPercent(sale.total_sale, sale.discount)) / 100)
        };

        api.post('/sales', sale)
            .then((res) =>
            (        
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                dispatch(cleanProductsCart()),
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

export const getAllSales = () => {
    const config = {
        transformResponse: [function (data) {

            const payload = JSON.parse(data).map(sale => {
                return {
                    ...sale,
                    // "total_sale": getCurrency(sale.total_sale),
                    "total_sale": sale.total_sale,
                    // "discount": getCurrency(sale.discount),
                    "discount": sale.discount,
                    // "sale_date": format(parseISO(sale.sale_date), 'dd/MM/yyyy hh:mm:ss'),
                    // "sale_date": sale.sale_date,
                }
            })
            return payload;
        }]
    }

    return (dispatch) => {
        dispatch(turnLoading());

        api
            .get('/sales', config)
            .then((res) => {
                dispatch(addSales(res.data));
                dispatch(turnLoading());
            })
            .catch(() => { dispatch(turnLoading()) })
    }
}

export const getAllSalesPerClient = (client, paied = "all") => {
    const config = {
        transformResponse: [function (data) {

            const payload = JSON.parse(data).map(sale => {
                return {
                    ...sale,
                    "total_sale": sale.total_sale,
                    "discount": sale.discount,
                    "created_at": sale.created_at
                    // "sale_date": format(parseISO(sale.sale_date), 'dd/MM/yyyy hh:mm:ss')
                }
            })
            return payload;
        }]
    }

    return (dispatch) => {
        dispatch(turnLoading());

        api
            .get(`/sales/salesPerClient/${client.id}/${paied}`, config)
            .then((res) => {
                dispatch(addSalesPerClient(res.data));
                paied === 'no' ? dispatch(turnModalGetPendingSales()) : paied === 'all' && dispatch(turnModalGetAllSales());
                dispatch(turnLoading());
            })
            .catch(() => { dispatch(turnLoading()) })
    }
}

export const toPaySalesFetch = (form, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());

        form = {
            ...form,
            // check: setCurrency(form.check),
            cash: setCurrency(form.cash),
            // card: setCurrency(form.card)
        };

        api.post(`/sales/pay`, form)
            .then((res) =>
            (
                dispatch(changeTitleAlert(res.data)),
                dispatch(getAllClients()),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                cleanForm()
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
}