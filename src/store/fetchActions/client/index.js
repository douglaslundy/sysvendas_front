import { cleanCpfCnpj } from "../../../components/helpers/formatt/cpf_cnpj";
import { getCurrency, setCurrency } from "../../../components/helpers/formatt/currency";
import { cleanPhone } from "../../../components/helpers/formatt/phone";
import api from "../../../services/api";
import { inactiveClient, addClient, editClient, addClients } from "../../ducks/clients";
import { turnAlert, addMessage, addAlertMessage, turnLoading } from "../../ducks/Layout";

export const getAllClients = () => {

    const config = {
        transformResponse: [function (data) {
                
            const payload = JSON.parse(data).map(d => {
                return {
                    ...d,
                "limit": getCurrency(d.limit)
                }
            })
            return payload;
          }]
    }

    return (dispatch) => {
        dispatch(turnLoading());

        api
            .get('/clients', config)
            .then((res) => {
                dispatch(addClients(res.data));
                dispatch(turnLoading());
            })
            .catch(() => {dispatch(turnLoading())})
    }
}

export const addClientFetch = (client, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());

        client = {
            ...client, 
            limit: setCurrency(client.limit),
            cpf_cnpj: cleanCpfCnpj(client.cpf_cnpj),
            phone: cleanPhone(client.phone)
        };

        api.post('/clients', client)
            .then((res) =>
            (
                client = {
                    ...res.data.client, 
                    limit: getCurrency(res.data.client.limit)
                },


                dispatch(addClient(client)),
                dispatch(addMessage(`O cliente ${client.full_name} foi adicionado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()), 
                cleanForm()
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                dispatch(turnLoading())
                return error.response.data
            })
    };
};


export const editClientFetch = (client, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());
        
        client = {
            ...client, 
            limit: setCurrency(client.limit),
            cpf_cnpj: cleanCpfCnpj(client.cpf_cnpj),
            phone: cleanPhone(client.phone)
        };
        
        api.put(`/clients/${client.id}`, client)
            .then((res) =>
            (
                client = {
                    ...res.data.client, 
                    limit: getCurrency(res.data.client.limit)
                },

                dispatch(editClient(client)),
                dispatch(addMessage(`O cliente ${client.full_name} foi atualizado com sucesso!`)),      
                dispatch(turnAlert()),
                dispatch(turnLoading()), 
                cleanForm()
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                dispatch(turnLoading())
                return error.response.data
            })
    };
}

export const inactiveClientFetch = (client) => {
    return (dispatch) => {
        dispatch(turnLoading())

        api.delete(`/clients/${client.id}`)
            .then((res) =>
            (
                dispatch(inactiveClient(client)),
                dispatch(addMessage(`O cliente ${client.full_name} foi inativado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
                dispatch(turnLoading());
            })
    }
}