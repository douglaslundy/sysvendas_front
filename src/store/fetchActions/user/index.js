import { api } from "../../../services/api";

import { inactiveUser, addUser, editUser, addUsers } from "../../ducks/users";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";

export const getAllUsers = () => {
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
    return (dispatch) => {
        dispatch(turnLoading())
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
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                dispatch(turnLoading())
                return error.response.data
            })
    };
};


export const editUserFetch = (user, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading()),
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
                    dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                    dispatch(turnLoading())
                    return error.response.data
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