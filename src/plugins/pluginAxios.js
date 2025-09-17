import axios from 'axios';

const token = JSON.parse(localStorage.getItem('pruebas')) || '';

export const apiClient = axios.create({
    //baseURL: 'http://localhost:4560/api',
    baseURL: 'https://inventario-15d8.onrender.com/api',
    headers: {
        "x-token": token.token
    }
});