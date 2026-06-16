import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

const setAccessToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
        localStorage.setItem('accessToken', token);
    }
};

const clearAccessToken = () => {
    delete apiClient.defaults.headers.common.Authorization;
    localStorage.removeItem('accessToken');
};

const existingToken = localStorage.getItem('accessToken');
if (existingToken) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
}

export const api = {
    authRegister: async (userData) => {
        let response = await apiClient.post('/auth/register', userData);
        setAccessToken(response.data.accessToken);
        console.log(response.data);
        return response.data;
    },
    authLogin: async (userData) => {
        let response = await apiClient.post('/auth/login', userData);
        setAccessToken(response.data.accessToken);
        console.log(response.data);
        return response.data;
    },
    authRefreshToken: async (refreshToken) => {
        let response = await apiClient.post('/auth/refresh', refreshToken);
        console.log(response.data);
        return response.data;
    },
    authLogout: async () => {
        clearAccessToken();
        let response = await apiClient.delete('/auth/logout');
        console.log(response.data);
        return response.data;
    },
    getProfile: async () => {
        let response = await apiClient.get('/profile');
        console.log(response.data);
        return response.data;
    },
    redactProfile: async (userData) => {
        let response = await apiClient.patch('/profile', userData);
        console.log(response.data);
        return response.data;
    },
    getIncidents: async (startDate, endDate ) => {
        let response = await apiClient.get(
            '/incidents', 
            { params: { startDate, endDate} }
        );
        console.log(response.data);
        return response.data;
    },
    postIncident: async (incidentData) => {
        let response = await apiClient.post('/incidents', incidentData);
        console.log(response.data);
        return response.data;
    },
    redactIncident: async (incidentId, incidentData) => {
        let response = await apiClient.patch(`/incidents/${incidentId}`, incidentData);
        console.log(response.data);
        return response.data;
    },
    deleteIncident: async (incidentId) => {
        let response = await apiClient.delete(`/incidents/${incidentId}`);
        console.log(response.data);
        return response.data;
    },
    getIncidentTypes: async () => {
        let response = await apiClient.get('/incidents/form/types');
        console.log(response.data);
        return response.data;
    },
    getIncidentStatuses: async () => {
        let response = await apiClient.get('/incidents/form/statuses');
        console.log(response.data);
        return response.data;
    },
    getParticipants: async () => {
        let response = await apiClient.get(
            '/participants', 
        );
        console.log(response.data);
        return response.data;
    },
    getParticipantsQuery: async (q) => {
        let response = await apiClient.get(
            `/participants/search`,
            { params: { q } }
        );
        console.log(response.data);
        return response.data;
    },
    postParticipant: async (participantData) => {
        let response = await apiClient.post('/participants', participantData);
        console.log(response.data);
        return response.data;
    },
    redactParticipants: async (participantId, participantData) => {
        let response = await apiClient.patch(`/participants/${participantId}`, participantData);
        console.log(response.data);
        return response.data;
    },
    deleteParticipant: async (participantId) => {
        let response = await apiClient.delete(`/participants/${participantId}`);
        console.log(response.data);
        return response.data;
    },
    getInvolvements: async () => {
        let response = await apiClient.get(
            '/involvements',
        );
        console.log(response.data);
        return response.data;
    },
    getInvolvementsQuery: async (q) => {
        let response = await apiClient.get(
            `/involvements/search`,
            { params: { q } }
        );
        console.log(response.data);
        return response.data;
    },
    postInvolvement: async (involvementData) => {
        let response = await apiClient.post('/involvements', involvementData);
        console.log(response.data);
        return response.data;
    },
    redactInvolvements: async (involvementId, involvementData) => {
        let response = await apiClient.patch(`/involvements/${involvementId}`, involvementData);
        console.log(response.data);
        return response.data;
    },
    deleteInvolvement: async (involvementId) => {
        let response = await apiClient.delete(`/involvements/${involvementId}`);
        console.log(response.data);
        return response.data;
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