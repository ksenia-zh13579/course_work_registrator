import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true, 
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

export const api = {
    authRegister: async (userData) => {
        let response = await apiClient.post('/auth/register', userData);
        return response.data;
    },
    authLogin: async (userData) => {
        let response = await apiClient.post('/auth/login', userData);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data;
    },
    authRefreshToken: async (refreshToken) => {
        let response = await apiClient.post('/auth/refresh', refreshToken);
        return response.data;
    },
    authLogout: async () => {
        let response = await apiClient.get('/auth/logout');
        return response.data;
    },
    getMain: async () => {
        let response = await apiClient.get('/auth/');
        return response.data;
    },
    getProfile: async () => {
        let response = await apiClient.get('/auth/profile');
        return response.data;
    },
    redactProfile: async (userData) => {
        let response = await apiClient.patch('/auth/profile', userData);
        return response.data;
    },
    getIncidents: async (startData, endData) => {
        let response = await apiClient.get('/auth/incidents', startData, endData);
        return response.data;
    },
    postIncidents: async (incidentData) => {
        let response = await apiClient.post('/auth/incidents', incidentData);
        return response.data;
    },
    redactIncident: async (incidentId, incidentData) => {
        let response = await apiClient.patch(`/auth/incidents/${incidentId}`, incidentData);
        return response.data;
    },
    deleteIncident: async (incidentId) => {
        let response = await apiClient.delete(`/auth/incidents/${incidentId}`);
        return response.data;
    },
    getParticipants: async () => {
        let response = await apiClient.get('/auth/participants');
        return response.data;
    },
    getParticipantsQuery: async (query) => {
        let response = await apiClient.get(`/auth/participants/search?q=${query}`);
        return response.data;
    },
    postParticipants: async (participantData) => {
        let response = await apiClient.post('/auth/participants', participantData);
        return response.data;
    },
    redactParticipants: async (participantId, participantData) => {
        let response = await apiClient.patch(`/auth/participants/${participantId}`, participantData);
        return response.data;
    },
    deleteParticipants: async (participantId) => {
        let response = await apiClient.delete(`/auth/participants/${participantId}`);
        return response.data;
    },
    getInvolvements: async () => {
        let response = await apiClient.get('/auth/involvements');
        return response.data;
    },
    getInvolvementsQuery: async (query) => {
        let response = await apiClient.get(`/auth/involvements/search?q=${query}`);
        return response.data;
    },
    postInvolvements: async (involvementData) => {
        let response = await apiClient.post('/auth/involvements', involvementData);
        return response.data;
    },
    redactInvolvements: async (involvementId, involvementData) => {
        let response = await apiClient.patch(`/auth/involvements/${involvementId}`, involvementData);
        return response.data;
    },
    deleteInvolvements: async (involvementId) => {
        let response = await apiClient.delete(`/auth/involvements/${involvementId}`);
        return response.data;
    },
};

apiClient.interceptors.request.use(
    (config) => {
        let accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        let accessToken = localStorage.getItem('accessToken');
        let refreshToken = localStorage.getItem('refreshToken');
        let originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (!accessToken || !refreshToken) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                return Promise.reject(error);
            }

            try {
                let response = await api.authRefreshToken(refreshToken);
                let isRefreshExpired = response.data.refresh_expired;

                if (isRefreshExpired) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');

                    return Promise.reject(error);
                }

                let newAccessToken = response.data.accessToken;
                let newRefreshToken = response.data.refreshToken;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                return apiClient(originalRequest);
            }
            catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error)
    }
);