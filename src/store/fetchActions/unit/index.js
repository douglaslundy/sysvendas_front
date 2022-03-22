import api from "../../../services/api";

import { inactiveUnit, addUnit, editUnit, addUnits } from "../../ducks/units";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";

export const getAllUnits = () => {
    return (dispatch) => {
        dispatch(turnLoading())
        api
            .get('/units')
            .then((res) => {
                dispatch(addUnits(res.data));
                dispatch(turnLoading());
            })
            .catch((error) =>{
                dispatch(turnLoading())
            })
    }
}

export const addUnitFetch = (unit) => {
    return (dispatch) => {
        dispatch(turnLoading())
        api.post('/units', unit)
            .then((res) =>
            (
                dispatch(addUnit(res.data.unit)),
                dispatch(addMessage(`A unidade ${res.data.unit.name} foi adicionado com sucesso!`)),
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


export const editUnitFetch = (unit) => {
    return (dispatch) => {

        dispatch(turnLoading()),
        api.put(`/units/${unit.id}`, unit)
            .then((res) =>
            (
                dispatch(editUnit(res.data.unit)),
                dispatch(addMessage(`A unidade ${res.data.unit.name} foi atualizado com sucesso!`)),      
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