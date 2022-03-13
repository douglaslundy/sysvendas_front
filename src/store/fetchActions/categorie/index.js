import api from "../../../services/api";

import { inactiveCategorie, addCategorie, editCategorie, addCategories } from "../../ducks/categories";
import { turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";

export const getAllCategories = () => {
    return (dispatch) => {
        api
            .get('/categorie')
            .then((res) => {
                dispatch(addCategories(res.data))
            })
            .catch(console.log)
            .then(console.log('eu fiz uma consulta por categorias no banco ' + new Date))
    }
}

export const addCategorieFetch = (categorie) => {
    return (dispatch) => {
        console.log(" em fetch actions  entrou na rota add Categoriee ");
        api.post('/categorie', categorie)
            .then((res) =>
            (
                dispatch(addCategorie(res.data.categorie)),
                dispatch(addMessage(`A categoria ${res.data.categorie.name} foi adicionado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
    };
};


export const editCategorieFetch = (categorie) => {
    return (dispatch) => {
        
        console.log(" em fetch actions entrou na rota Editar Categorie " + categorie.id);
        api.put(`/categorie/${categorie.id}`, categorie)
            .then((res) =>
            (
                console.log(res.data),
                dispatch(editCategorie(res.data.categorie)),
                dispatch(addMessage(`A categoria ${res.data.categorie.name} foi atualizado com sucesso!`)),      
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
    };
}

export const inactiveCategorieFetch = (categorie) => {
    return (dispatch) => {
        api.delete(`/categorie/${categorie.id}`)
            .then((res) =>
            (
                dispatch(inactiveCategorie(categorie)),
                dispatch(addMessage(`A categoria ${categorie.name} foi inativado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
                return error;
            })
    }
}