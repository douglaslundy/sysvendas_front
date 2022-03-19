import api from "../../../services/api";

import { inactiveCategorie, addCategorie, editCategorie, addCategories } from "../../ducks/categories";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";

export const getAllCategories = () => {
    return (dispatch) => {
        api
            .get('/categorie')
            .then((res) => {
                dispatch(turnLoading())
                dispatch(addCategories(res.data))
            })
            .catch(console.log)
            .then(dispatch(turnLoading()))
    }
}

export const addCategorieFetch = (categorie) => {
    return (dispatch) => {
        console.log(" em fetch actions  entrou na rota add Categoriee ");
        api.post('/categorie', categorie)
            .then((res) =>
            (
                dispatch(turnLoading()),
                dispatch(addCategorie(res.data.categorie)),
                dispatch(addMessage(`A categoria ${res.data.categorie.name} foi adicionado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
            .then(dispatch(turnLoading()))
    };
};


export const editCategorieFetch = (categorie) => {
    return (dispatch) => {
        
        console.log(" em fetch actions entrou na rota Editar Categorie " + categorie.id);
        api.put(`/categorie/${categorie.id}`, categorie)
            .then((res) =>
            (
                dispatch(turnLoading()),
                dispatch(editCategorie(res.data.categorie)),
                dispatch(addMessage(`A categoria ${res.data.categorie.name} foi atualizado com sucesso!`)),      
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
            .then(dispatch(turnLoading()))
    };
}

export const inactiveCategorieFetch = (categorie) => {
    return (dispatch) => {
        api.delete(`/categorie/${categorie.id}`)
            .then((res) =>
            (   
                dispatch(turnLoading()),
                dispatch(inactiveCategorie(categorie)),
                dispatch(addMessage(`A categoria ${categorie.name} foi inativado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
                return error;
            })
            then(dispatch(turnLoading()))
    }
}