import { getCurrency } from "../../../components/helpers/formatt/currency";
import { api } from "../../../services/api";
import { editSale, addSales } from "../../ducks/sales";
import { turnAlert, addMessage, addAlertMessage, turnLoading } from "../../ducks/Layout";

export const getAllSales = () => {
    const config = {
        transformResponse: [function (data) {

            const payload = JSON.parse(data).map(s => {
                return {
                    ...s,
                    "total_sale": getCurrency(s.total_sale)
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
