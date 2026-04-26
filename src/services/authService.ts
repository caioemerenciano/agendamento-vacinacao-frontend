import { api } from './api';

export interface User {
    email: string;
    senha?: string;
}

export const servicoAutenticacao = {
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

    estaAutenticado: (): boolean => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;

            const payloadBase64 = parts[1];
            const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const decodedPayload = JSON.parse(atob(base64));

            const now = Math.floor(Date.now() / 1000);
            if (decodedPayload.exp && decodedPayload.exp < now) {
                console.warn('Token expirado detectado. Realizando logout automático.');
                servicoAutenticacao.logout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erro ao validar token JWT:', error);
            servicoAutenticacao.logout();
            return false;
        }
    },

    getUsuarioId: (): number | null => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                // O backend agora retorna 'Id' ou 'id' no LoginResponse record
                return user.Id || user.id || null;
            } catch (e) {
                console.error('Erro ao ler ID do usuário do storage:', e);
            }
        }
        return null;
    },

    getUsuarioPerfil: (): string | null => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                return user.Perfil || user.perfil || null;
            } catch (e) {
                console.error('Erro ao ler Perfil do usuário do storage:', e);
            }
        }
        return null;
    }
};
