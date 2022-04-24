import { api } from "../../../services/api";

import { inactiveUnit, addUnit, editUnit, addUnits } from "../../ducks/units";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";
import { parseCookies } from "nookies";

function getToken() {
    const { 'sysvendas.token': token } = parseCookies();    
    token ? api.defaults.headers['Authorization'] = `Bearer ${token}` : Router.push('/login');
}

export const getAllUnits = () => {
    getToken();
    return (dispatch) => {
        dispatch(turnLoading())
        api
            .get('/units')
            .then((res) => {
                dispatch(addUnits(res.data));
                dispatch(turnLoading());
            })
            .catch((error) => {
                dispatch(turnLoading())
            })
    }
}

export const getAllUnitsToSelect = () => {
    return (dispatch) => {
        api
            .get('/units')
            .then((res) => {
                dispatch(addUnits(res.data));
            })
            .catch((error) => {
            })
    }
}

export const addUnitFetch = (unit, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading())
        api.post('/units', unit)
            .then((res) =>
            (

                dispatch(addUnit(res.data.unit)),
                dispatch(addMessage(`A unidade ${res.data.unit.name} foi adicionado com sucesso!`)),
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


export const editUnitFetch = (unit, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading()),
            api.put(`/units/${unit.id}`, unit)
                .then((res) =>
                (
                    dispatch(editUnit(res.data.unit)),
                    dispatch(addMessage(`A unidade ${res.data.unit.name} foi atualizado com sucesso!`)),
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

export const inactiveUnitFetch = (unit) => {
    return (dispatch) => {
        dispatch(turnLoading())
        api.delete(`/units/${unit.id}`)
            .then((res) =>
            (
                dispatch(inactiveUnit(unit)),
                dispatch(addMessage(`A unidade ${unit.name} foi deletada com sucesso!`)),
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