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
                Router.push('/')
            ))
            .catch((error) => {

                dispatch(addAlertMessage(error.response ? ` ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};

export const logoutFetch = () => {
    getToken();
    return (dispatch) => {
        dispatch(turnLoading())
        api
            .post('/logout')
            .then((res) =>
            (
                dispatch(turnLoading()),
                Router.push('/login'),
            ))
            .catch((error) => {
                dispatch(addAlertMessage(error.response ? `ERROR - ${error.response.data.message} ` : 'Erro desconhecido'));
                dispatch(turnLoading());
                return error.response ? error.response.data : 'erro desconhecido';
            })
    };
};