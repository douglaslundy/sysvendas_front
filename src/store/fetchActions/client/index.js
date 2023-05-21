import { cleanCpfCnpj } from "../../../components/helpers/formatt/cpf_cnpj";
import { getCurrency, setCurrency } from "../../../components/helpers/formatt/currency";
import { cleanPhone } from "../../../components/helpers/formatt/phone";
import { api } from "../../../services/api";
import { inactiveClient, addClient, editClient, addClients } from "../../ducks/clients";
import { turnAlert, addMessage, addAlertMessage, turnLoading } from "../../ducks/Layout";

// function getToken() {
//     const { 'sysvendas.token': token } = parseCookies();    
//     token ? api.defaults.headers['Authorization'] = `Bearer ${token}` : Router.push('/login');
// }

export const getAllClients = () => {
    //     getToken();
    const config = {
        transformResponse: [function (data) {

            const payload = JSON.parse(data).map(d => {
                return {
                    "id": d.id,
                    "full_name": d.full_name,
                    "surname": d.surname,
                    "email": d.email,
                    "im": d.im,
                    "ie": d.ie,
                    "fantasy_name": d.fantasy_name,
                    "limit": getCurrency(d.limit),
                    "debit_balance": getCurrency(d.debit_balance),
                    "obs": d.obs,
                    "cpf_cnpj": cleanCpfCnpj(d.cpf_cnpj),
                    "phone": cleanPhone(d.phone),
                    "zip_code": d.addresses.zip_code,
                    "city": d.addresses.city,
                    "street": d.addresses.street,
                    "number": d.addresses.number,
                    "district": d.addresses.district,
                    "complement": d.addresses.complement
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
            .catch(() => { dispatch(turnLoading()) })
    }
}

export const addClientFetch = (client, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());

        client = {
            full_name: client.full_name,
            surname: client.surname,
            email: client.email,
            im: client.im,
            ie: client.ie,
            fantasy_name: client.fantasy_name,
            obs: client.obs,
            limit: setCurrency(client.limit),
            cpf_cnpj: cleanCpfCnpj(client.cpf_cnpj),
            phone: cleanPhone(client.phone),

            addresses: {
                zip_code: client.zip_code,
                city: client.city,
                street: client.street,
                number: client.number,
                district: client.district,
                complement: client.complement
            }
        };

        api.post('/clients', client)
            .then((res) =>
            (
                client = {
                    ...res.data.client,
                    limit: getCurrency(res.data.client.limit),
                    ...client.addresses,
                },
                dispatch(addClient(client)),
                dispatch(addMessage(`O cliente ${client.full_name} foi adicionado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                cleanForm()
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};

export const editClientFetch = (client, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());

        client = {
            ...client,
            limit: setCurrency(client.limit),
            debit_balance: setCurrency(client.debit_balance),
            cpf_cnpj: cleanCpfCnpj(client.cpf_cnpj),
            phone: cleanPhone(client.phone),
            addresses: {
                zip_code: client.zip_code,
                city: client.city,
                street: client.street,
                number: client.number,
                district: client.district,
                complement: client.complement
            }
        };

        api.put(`/clients/${client.id}`, client)
            .then((res) =>
            (
                client = {
                    ...res.data.client,
                    limit: getCurrency(res.data.client.limit),
                    debit_balance: getCurrency(res.data.client.debit_balance),
                    ...client.addresses,
                },

                dispatch(editClient(client)),
                dispatch(addMessage(`O cliente ${client.full_name} foi atualizado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                cleanForm()
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error ? error.response.data.message : 'erro desconhecido';
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
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `));
                dispatch(turnLoading());
            })
    }
}