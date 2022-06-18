import { api } from "../../../services/api";
import { getCurrency, setCurrency } from "../../../components/helpers/formatt/currency";
import { parseCookies } from 'nookies';
import { cleanProductsCart } from "../../ducks/cart";
import { editSale, addSales, addSalesPerClient } from "../../ducks/sales";
import { turnAlert, addMessage, addAlertMessage, turnLoading, turnModalGetSales } from "../../ducks/Layout";
import { parseISO, format } from 'date-fns';

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
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};

export const getAllSales = () => {
    const config = {
        transformResponse: [function (data) {

            const payload = JSON.parse(data).map(s => {
                return {
                    ...s,
                    "total_sale": getCurrency(s.total_sale),
                    "sale_date": format(parseISO(s.sale_date), 'dd/MM/yyyy hh:mm:ss')
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

            const payload = JSON.parse(data).map(s => {
                return {
                    ...s,
                    "total_sale": getCurrency(s.total_sale),
                    "sale_date": format(parseISO(s.sale_date), 'dd/MM/yyyy hh:mm:ss')
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
                dispatch(turnModalGetSales());
                dispatch(turnLoading());
            })
            .catch(() => { dispatch(turnLoading()) })
    }
}

export const editSaleFetch = (sale, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());


        api.put(`/sale/${sale.id}`, sale)
            .then((res) =>
            (
                dispatch(editSale(sale)),
                dispatch(addMessage(`Venda foi atualizada com sucesso!`)),
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
