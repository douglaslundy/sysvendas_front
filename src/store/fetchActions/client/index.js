import api from "../../../services/api";
import { inactiveClient, addClient, editClient, addClients } from "../../ducks/clients";
import { turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";

export const getAllClients = () => {
    return (dispatch) => {
        api
            .get('/clients')
            .then((res) => {
                dispatch(addClients(res.data))
            })
            .catch(console.log)
            .then(console.log('eu fiz uma consulta por clientes no banco ' + new Date))
    }
}

export const addClientFetch = (client) => {
    return (dispatch) => {
        console.log(" em fetch actions  entrou na rota add Cliente ");
        api.post('/clients', client)
            .then((res) =>
            (
                dispatch(addClient(res.data.client)),
                dispatch(addMessage(`O cliente ${res.data.client.full_name} foi adicionado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
    };
};


export const editClientFetch = (client) => {
    return (dispatch) => {
        
        console.log(" em fetch actions entrou na rota Editar Cliente " + client.id);
        api.put(`/clients/${client.id}`, client)
            .then((res) =>
            (
                dispatch(editClient(res.data.client)),
                dispatch(addMessage(`O cliente ${res.data.client.full_name} foi atualizado com sucesso!`)),      
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
    };
}

export const inactiveClientFetch = (client) => {
    return (dispatch) => {
        api.delete(`/clients/${client.id}`)
            .then((res) =>
            (
                dispatch(inactiveClient(client)),
                dispatch(addMessage(`O cliente ${client.full_name} foi inativado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
            })
    }
}