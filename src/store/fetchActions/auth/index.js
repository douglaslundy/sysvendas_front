import { api } from "../../../services/api";
import { setCookie } from 'nookies';
import { inactiveUser, addUser, editUser, addUsers } from "../../ducks/users";
import { turnLoading, addAlertMessage } from "../../ducks/Layout";
import { isAuth } from "../../ducks/auth";
import Router from "next/router";
import { parseCookies } from "nookies";

function getToken() {
    const { 'sysvendas.token': token } = parseCookies();
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export const loginFetch = (dataUser) => {
    return (dispatch) => {
        dispatch(turnLoading())
        api.post('/login', dataUser)
            .then((res) =>
            (
                // localStorage.setItem('token', res.data.token),

                setCookie(undefined, 'sysvendas.token', res.data.token, {
                    maxAge: 60 * 60 * 72, // 72 hour
                }),

                setCookie(undefined, 'sysvendas.id', res.data.user.id, {
                    maxAge: 60 * 60 * 72, // 72 hour
                }),
                setCookie(undefined, 'sysvendas.username', res.data.user.name, {
                    maxAge: 60 * 60 * 72, // 72 hour
                }),

                setCookie(undefined, 'sysvendas.profile', res.data.user.profile, {
                    maxAge: 60 * 60 * 72, // 72 hour
                }),


                dispatch(turnLoading()),
                dispatch(isAuth(true)),
                Router.push('/')
            ))
            .catch((error) => {
                console.log('Erro ' + error.response.data.message),
                    dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                dispatch(turnLoading())
                return error.response.data
            })
    };
};

export const logoutFetch = () => {
    getToken()
    return (dispatch) => {
        dispatch(turnLoading())
        api
            .post('/logout')
            .then((res) =>
            (
                console.log('token deletado ' + res.data.message),
                dispatch(turnLoading()),
                dispatch(isAuth(true)),
                Router.push('/login'),
            ))
            .catch((error) => {
                console.log('erro ao deletar token')
                dispatch(addAlertMessage(`ERROR - ${error.response.data.message} `))
                dispatch(turnLoading())
                return error.response.data
            })
    };
};