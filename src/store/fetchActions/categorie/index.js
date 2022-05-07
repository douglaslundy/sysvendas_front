import { api } from "../../../services/api";
import  Router from "next/router";
import { inactiveCategorie, addCategorie, editCategorie, addCategories } from "../../ducks/categories";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";
import { parseCookies } from "nookies";

// function getToken() {
//     const { 'sysvendas.token': token } = parseCookies();    
//     token ? api.defaults.headers['Authorization'] = `Bearer ${token}` : Router.push('/login');
// }

export const getAllCategories = () => {
    // getToken();
    return (dispatch) => {
        dispatch(turnLoading());

        api
            .get('/categorie')
            .then((res) => {
                dispatch(addCategories(res.data));
                dispatch(turnLoading());
            })
            .catch(() => { dispatch(turnLoading()) })
    }
}

export const getAllCategoriesToSelect = () => {
    return (dispatch) => {

        api
            .get('/categorie')
            .then((res) => {
                dispatch(addCategories(res.data));
            })
            .catch(() => { })
    }
}

export const addCategorieFetch = (categorie, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());

        api.post('/categorie', categorie)
            .then((res) =>
            (
                dispatch(addCategorie(res.data.categorie)),
                dispatch(addMessage(`A categoria ${res.data.categorie.name} foi adicionado com sucesso!`)),
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
};


export const editCategorieFetch = (categorie, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading());

        api.put(`/categorie/${categorie.id}`, categorie)
            .then((res) =>
            (
                dispatch(editCategorie(res.data.categorie)),
                dispatch(addMessage(`A categoria ${res.data.categorie.name} foi atualizado com sucesso!`)),
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

export const inactiveCategorieFetch = (categorie) => {
    return (dispatch) => {
        dispatch(turnLoading());

        api.delete(`/categorie/${categorie.id}`)
            .then((res) =>
            (
                dispatch(inactiveCategorie(categorie)),
                dispatch(addMessage(`A categoria ${categorie.name} foi inativado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
                dispatch(turnLoading());
                return error;
            })
    }
}