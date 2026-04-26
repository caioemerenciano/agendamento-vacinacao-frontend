import { api } from './api';

export interface User {
    email: string;
    senha?: string;
}

export const authService = {
    registrar: async (email: string, senha: string) => {
        const response = await api.post('/auth/registrar', { email, senha });
        return response.data;
    },

    login: async (email: string, senha: string) => {
        const response = await api.post('/auth/login', { email, senha });
        let data = response.data;

        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.warn('Backend retornou uma string que não é um JSON válido:', data);
            }
        }

        const token = data?.token || data?.Token;

        if (token && typeof token === 'string') {
            try {
                localStorage.setItem('token', token);
                console.log('Token salvo com sucesso no LocalStorage.');
            } catch (error) {
                console.error('Falha ao salvar o token no LocalStorage (QuotaExceeded ou Modo Privado):', error);
            }

            try {
                if (typeof data === 'object' && data !== null) {
                    localStorage.setItem('user', JSON.stringify(data));
                }
            } catch (error) {
                console.error('Falha ao salvar os dados do usuário no LocalStorage:', error);
            }
        } else {
            console.error('Token não encontrado ou formato inválido recebido da API. Data recebida:', data);
        }

        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    }
};
