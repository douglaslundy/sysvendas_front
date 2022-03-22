import api from "../../../services/api";
import { inactiveClient, addClient, editClient, addClients } from "../../ducks/clients";
import { turnAlert, addMessage, addAlertMessage, turnLoading } from "../../ducks/Layout";

export const getAllClients = () => {
    return (dispatch) => {
        dispatch(turnLoading());

        api
            .get('/clients')
            .then((res) => {
                dispatch(addClients(res.data));
                dispatch(turnLoading());
            })
            .catch(() => {dispatch(turnLoading())})
    }
}

export const addClientFetch = (client) => {
    return (dispatch) => {
        dispatch(turnLoading());

        api.post('/clients', client)
            .then((res) =>
            (
                dispatch(addClient(res.data.client)),
                dispatch(addMessage(`O cliente ${res.data.client.full_name} foi adicionado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                dispatch(turnLoading())
                return error.response.data
            })
    };
};


export const editClientFetch = (client) => {
    return (dispatch) => {
        dispatch(turnLoading())
        
        api.put(`/clients/${client.id}`, client)
            .then((res) =>
            (
                dispatch(editClient(res.data.client)),
                dispatch(addMessage(`O cliente ${res.data.client.full_name} foi atualizado com sucesso!`)),      
                dispatch(turnAlert()),
                dispatch(turnLoading())
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