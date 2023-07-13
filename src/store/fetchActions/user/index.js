import { api } from "../../../services/api";
import { cleanCpfCnpj } from "../../../components/helpers/formatt/cpf_cnpj";
import { inactiveUser, addUser, editUser, addUsers, showUser } from "../../ducks/users";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";
import { parseCookies } from "nookies";

export const getAllUsers = () => {
    // getToken();
    return (dispatch) => {
        dispatch(turnLoading())
        api
            .get('/users')
            .then((res) => {
                dispatch(addUsers(res.data));
                dispatch(turnLoading());
            })
            .catch((error) => {
                dispatch(turnLoading())
            })
    }
}

export const addUserFetch = (user, cleanForm) => {
    const { 'sysvendas.company_id': company } = parseCookies();

    return (dispatch) => {
        dispatch(turnLoading())
        user = {
            ...user,
            cpf: cleanCpfCnpj(user.cpf),
            company_id: company,
        };
        api.post('/users', user)
            .then((res) =>
            (
                dispatch(addUser(res.data.user)),
                dispatch(addMessage(`Usuário ${res.data.user.name} foi adicionado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                cleanForm(),
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};


export const editUserFetch = (user, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading()),
        user = {
            ...user,
            cpf: cleanCpfCnpj(user.cpf),
        };

            api.put(`/users/${user.id}`, user)
                .then((res) =>
                (
                    dispatch(editUser(res.data.user)),
                    dispatch(addMessage(`Usuário ${res.data.user.name} foi atualizado com sucesso!`)),
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

export const getUserFetch = (user) => {
    return (dispatch) => {
        dispatch(turnLoading()),
            api.get(`/users/${user}`)
                .then((res) =>
                (
                    dispatch(showUser(res.data)),
                    dispatch(turnLoading()),
                ))
                .catch((error) => {
                    dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                    dispatch(turnLoading());
                    return error.response ? error.response.data : 'erro desconhecido';
                })
    };
}


export const inactiveUserFetch = (user) => {
    return (dispatch) => {
        dispatch(turnLoading())
        api.delete(`/users/${user.id}`)
            .then((res) =>
            (
                dispatch(inactiveUser(user)),
                dispatch(addMessage(`Usuário ${user.name} foi deletado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
                dispatch(turnLoading())
                return error;
            })
    }
}