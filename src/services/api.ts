import axios from 'axios';
import { modalService } from './modalService';

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
            // Se for erro de login, não deve deslogar nem disparar o modal global de sessão expirada
            const isAuthRequest = error.config.url?.includes('/') || error.config.url?.includes('/login');

            if (!isAuthRequest) {
                localStorage.removeItem('token');
                modalService.showError('Sua sessão expirou. Por favor, faça login novamente para continuar.', 'Sessão Expirada');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);