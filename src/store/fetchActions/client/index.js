import api from "../../../services/api";
import { inactiveClient, addClient, editClient, addClients } from "../../ducks/clients";
import { turnAlert, addMessage, addAlertMessage, turnLoading } from "../../ducks/Layout";

export const getAllClients = () => {
    return (dispatch) => {
        api
            .get('/clients')
            .then((res) => {
                dispatch(turnLoading());
                dispatch(addClients(res.data));
            })
            .catch(console.log)
            .then(dispatch(turnLoading()))
    }
}

export const addClientFetch = (client) => {
    return (dispatch) => {
        api.post('/clients', client)
            .then((res) =>
            (
                dispatch(turnLoading()),
                dispatch(addClient(res.data.client)),
                dispatch(addMessage(`O cliente ${res.data.client.full_name} foi adicionado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
            .then(dispatch(turnLoading()))
    };
};


export const editClientFetch = (client) => {
    return (dispatch) => {
        
        api.put(`/clients/${client.id}`, client)
            .then((res) =>
            (
                dispatch(turnLoading()),
                dispatch(editClient(res.data.client)),
                dispatch(addMessage(`O cliente ${res.data.client.full_name} foi atualizado com sucesso!`)),      
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
            .then(dispatch(turnLoading()))
    };
}

export const inactiveClientFetch = (client) => {
    return (dispatch) => {
        api.delete(`/clients/${client.id}`)
            .then((res) =>
            (
                dispatch(turnLoading()),
                dispatch(inactiveClient(client)),
                dispatch(addMessage(`O cliente ${client.full_name} foi inativado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
            })
            .then(dispatch(turnLoading()))
    }
}