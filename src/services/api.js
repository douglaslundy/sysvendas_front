import axios from "axios";

export default axios.create({
    // baseURL: 'https://dlsistemas.os.srv.br/api',
    baseURL: 'http://localhost:8000/api',
});