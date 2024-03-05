import { api } from "../../../services/api";
import { convertToDecimalWith2DigitsAfterComma, setCurrency } from "../../../components/helpers/formatt/currency";
import { parseCookies } from 'nookies';
import { cleanProductsCart } from "../../ducks/cart";
import { addSales, addSalesPerClient } from "../../ducks/sales";
import { turnAlert, addAlertMessage, turnLoading, turnModalGetPendingSales, turnModalGetAllSales, changeTitleAlert } from "../../ducks/Layout";
import { getAllClients } from "../client";
import salePDF from "../../../reports/sale";

import { format } from 'date-fns';

import { valueDecrescidFromPercent } from '../../../components/helpers/functions/percent';
import blockedClientsPdf from "../../../reports/blockedClients";


export const addSale = (sale, cleanForm) => {
    const { 'sysvendas.id': user } = parseCookies();
    return (dispatch) => {
        dispatch(turnLoading());

        sale = {
            ...sale,
            id_seller: sale.id_user ? sale.id_user : null,
            id_user: user,

            pay_value: setCurrency(sale.pay_value),
            cash: setCurrency(sale.cash),
            total_sale: setCurrency(sale.total_sale),
            
            // esta rotina converte o desconto que chega em percentagem, exemplo : 50% para o valor decimal real, exemplo 10000
            discount: convertToDecimalWith2DigitsAfterComma(sale.total_sale - valueDecrescidFromPercent(sale.total_sale, sale.discount))
        };

        console.log(`Venda é ${JSON.stringify(sale)}`)
        api.post('/sales', sale)
            .then((res) =>
            (
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                dispatch(cleanProductsCart()),
                cleanForm(),
                console.log(`Venda ${JSON.stringify(...res.data.sale)}`),
                salePDF(...res.data.sale)
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


export const getAllSalesPerDate = (dateBegin, dateEnd) => {

    const form = {};

    if (dateBegin) {
        form.date_begin = format(dateBegin, 'yyyy/MM/dd');
    }

    if (dateEnd) {
        form.date_end = format(dateEnd, 'yyyy/MM/dd');
    }

    const config = {
        transformResponse: [function (data) {

            const payload = JSON.parse(data).map(sale => {
                return {
                    ...sale,
                    "total_sale": sale.total_sale,
                    "discount": sale.discount
                }
            })
            return payload;
        }]
    }

    return (dispatch) => {
        dispatch(turnLoading());

        api
            .get(`/sales`, { params: form, ...config }) // Pass the 'form' object as a request parameter
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
            discount: setCurrency(form.discount),
            payable: setCurrency(form.payable),
            totalSale: setCurrency(form.totalSale),
            troco: setCurrency(form.troco),
            // card: setCurrency(form.card)
        };

        console.log(`vendas a receber ${JSON.stringify({...form})}`)

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


export const checkOverdueSales = () => {
    return (dispatch) => {
        dispatch(turnLoading());

        api.get(`/sales/getBlockedClients/get`)
            .then((res) =>
            (
                res.data.length <= 0 
                ?
                dispatch(addAlertMessage('A busca não encontrou registros, você não teve clientes bloqueados hoje!!!'))
                : 
                blockedClientsPdf(res.data),
                dispatch(turnLoading())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
}