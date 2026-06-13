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
        return response;
    },
    authLogin: async (userData) => {
        let response = await apiClient.post('/auth/login', userData);
        // localStorage.setItem('accessToken', response.data.accessToken);
        // localStorage.setItem('refreshToken', response.data.refreshToken);
        return response;
    },
    authRefreshToken: async (refreshToken) => {
        let response = await apiClient.post('/auth/refresh', refreshToken);
        return response;
    },
    authLogout: async () => {
        let response = await apiClient.delete('/auth/logout');
        return response;
    },
    getProfile: async () => {
        let response = await apiClient.get('/auth/profile');
        return response;
    },
    redactProfile: async (userData) => {
        let response = await apiClient.patch('/auth/profile', userData);
        return response;
    },
    getIncidents: async (startData, endData ) => {
        let response = await apiClient.get(
            '/auth/incidents', 
            { params: { startData, endData} }
        );
        return response;
    },
    postIncident: async (incidentData) => {
        let response = await apiClient.post('/auth/incidents', incidentData);
        return response;
    },
    redactIncident: async (incidentId, incidentData) => {
        let response = await apiClient.patch(`/auth/incidents/${incidentId}`, incidentData);
        return response;
    },
    deleteIncident: async (incidentId) => {
        let response = await apiClient.delete(`/auth/incidents/${incidentId}`);
        return response;
    },
    getIncidentTypes: async () => {
        let response = await apiClient.get('/auth/incidents/form/types');
        return response;
    },
    getIncidentStatuses: async () => {
        let response = await apiClient.get('/auth/incidents/form/statuses');
        return response;
    },
    getParticipants: async () => {
        let response = await apiClient.get(
            '/auth/participants', 
        );
        return response;
    },
    getParticipantsQuery: async (q) => {
        let response = await apiClient.get(
            `/auth/participants/search`,
            { params: { q } }
        );
        return response;
    },
    postParticipant: async (participantData) => {
        let response = await apiClient.post('/auth/participants', participantData);
        return response;
    },
    redactParticipants: async (participantId, participantData) => {
        let response = await apiClient.patch(`/auth/participants/${participantId}`, participantData);
        return response;
    },
    deleteParticipant: async (participantId) => {
        let response = await apiClient.delete(`/auth/participants/${participantId}`);
        return response;
    },
    getInvolvements: async () => {
        let response = await apiClient.get(
            '/auth/involvements',
        );
        return response;
    },
    getInvolvementsQuery: async (q) => {
        let response = await apiClient.get(
            `/auth/involvements/search`,
            { params: { q } }
        );
        return response;
    },
    postInvolvement: async (involvementData) => {
        let response = await apiClient.post('/auth/involvements', involvementData);
        return response;
    },
    redactInvolvements: async (involvementId, involvementData) => {
        let response = await apiClient.patch(`/auth/involvements/${involvementId}`, involvementData);
        return response;
    },
    deleteInvolvement: async (involvementId) => {
        let response = await apiClient.delete(`/auth/involvements/${involvementId}`);
        return response;
    },
};

/*
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
*/

/*
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
*/

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
                const newAccessToken = data.accessToken;

                apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);