import axios from "axios";
import { parseCookies } from 'nookies';

const { 'sysvendas.token': token } = parseCookies();

export const api = axios.create({
    baseURL: 'https://dlsistemas.com.br/api'
    // ou
    // baseURL: 'http://localhost:8000/api' 
});

if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
}
