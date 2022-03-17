import api from "../../../services/api";

import { inactiveUnit, addUnit, editUnit, addUnits } from "../../ducks/units";
import { turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";

export const getAllUnits = () => {
    return (dispatch) => {
        api
            .get('/units')
            .then((res) => {
                dispatch(addUnits(res.data))
            })
            .catch(console.log)
            .then(console.log('eu fiz uma consulta por unidades no banco ' + new Date))
    }
}

export const addUnitFetch = (unit) => {
    return (dispatch) => {
        console.log(" em fetch actions  entrou na rota add Unite ");
        api.post('/units', unit)
            .then((res) =>
            (
                dispatch(addUnit(res.data.unit)),
                dispatch(addMessage(`A unidade ${res.data.unit.name} foi adicionado com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
    };
};


export const editUnitFetch = (unit) => {
    return (dispatch) => {
        
        console.log(" em fetch actions entrou na rota Editar Unit " + unit.id);
        api.put(`/units/${unit.id}`, unit)
            .then((res) =>
            (
                console.log(res.data),
                dispatch(editUnit(res.data.unit)),
                dispatch(addMessage(`A unidade ${res.data.unit.name} foi atualizado com sucesso!`)),      
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                return error.response.data
            })
    };
}

export const inactiveUnitFetch = (unit) => {
    return (dispatch) => {
        api.delete(`/units/${unit.id}`)
            .then((res) =>
            (
                dispatch(inactiveUnit(unit)),
                dispatch(addMessage(`A unidade ${unit.name} foi deletada com sucesso!`)),
                dispatch(turnAlert())
            ))
            .catch((error) => {
                dispatch(addMessage(`ERROR - ${error} `));
                return error;
            })
    }
}