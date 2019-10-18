import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:3333',
    baseURL: 'https://othonrm-aircnc-web.herokuapp.com',
});

export default api;
