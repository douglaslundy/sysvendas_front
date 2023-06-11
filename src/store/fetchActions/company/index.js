import { api } from "../../../services/api";
import { cleanCpfCnpj } from "../../../components/helpers/formatt/cpf_cnpj";
import { editCompany, showCompany } from "../../ducks/companies";
import { turnLoading, turnAlert, addMessage, addAlertMessage } from "../../ducks/Layout";
import CryptoJS from 'crypto-js';


// export const getAllUsers = () => {
//     // getToken();
//     return (dispatch) => {
//         dispatch(turnLoading())
//         api
//             .get('/users')
//             .then((res) => {
//                 dispatch(addUsers(res.data));
//                 dispatch(turnLoading());
//             })
//             .catch((error) => {
//                 dispatch(turnLoading())
//             })
//     }
// }

// export const addUserFetch = (user, cleanForm) => {
//     return (dispatch) => {
//         dispatch(turnLoading())
//         user = {
//             ...user,
//             cnpj: cleancnpjCnpj(user.cnpj),
//         };
//         api.post('/users', user)
//             .then((res) =>
//             (
//                 dispatch(addUser(res.data.user)),
//                 dispatch(addMessage(`Usuário ${res.data.user.name} foi adicionado com sucesso!`)),
//                 dispatch(turnAlert()),
//                 dispatch(turnLoading()),
//                 cleanForm(),
//             ))
//             .catch((error) => {
//                 dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
//                 dispatch(turnLoading());
//                 return error.response ? error.response.data : 'erro desconhecido';
//             })
//     };
// };


export const editCompanyFetch = (company, cleanForm) => {
    return (dispatch) => {
        dispatch(turnLoading()),
            company = {
                ...company,
                cnpj: cleanCpfCnpj(company.cnpj),
                master_password: CryptoJS.MD5(company.password).toString()
            };
        api.put(`/companies/${company.id}`, company)
            .then((res) =>
            (                
                dispatch(editCompany(res.data)),
                dispatch(addMessage(`A empresa ${res.data.fantasy_name} foi atualizado com sucesso!`)),
                dispatch(turnAlert()),
                dispatch(turnLoading()),
                cleanForm()
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                // dispatch(addAlertMessage(error ? `ERROR - ${error} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
}

export const getCompanyFetch = (company) => {
    return (dispatch) => {
        dispatch(turnLoading()),
            api.get(`/companies/${company}`)
                .then((res) =>
                (
                    dispatch(showCompany(res.data)),
                    dispatch(turnLoading()),
                ))
                .catch ((error) => {
    dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
    dispatch(turnLoading());
    return error.response ? error.response.data : 'erro desconhecido';
})
    };
}


// export const inactiveUserFetch = (user) => {
//     return (dispatch) => {
//         dispatch(turnLoading())
//         api.delete(`/users/${user.id}`)
//             .then((res) =>
//             (
//                 dispatch(inactiveUser(user)),
//                 dispatch(addMessage(`Usuário ${user.name} foi deletado com sucesso!`)),
//                 dispatch(turnAlert()),
//                 dispatch(turnLoading())
//             ))
//             .catch((error) => {
//                 dispatch(addMessage(`ERROR - ${error} `));
//                 dispatch(turnLoading())
//                 return error;
//             })
//     }
// }