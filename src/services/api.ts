import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5056/api',
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            alert('Sua sessão expirou. Por favor, faça login novamente para continuar.');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);