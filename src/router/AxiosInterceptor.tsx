import axios from 'axios';

const api = axios.create({
    baseURL: "https://sugarytestapi.azurewebsites.net",
});

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/Account/RefreshToken')
        ) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(
                    'https://sugarytestapi.azurewebsites.net/Account/RefreshToken',
                    {
                        AccessToken: getAccessToken(),
                        RefreshToken: getRefreshToken(),
                    }
                );

                const { Token, RefreshToken } = refreshResponse.data;

                localStorage.setItem('accessToken', Token);
                localStorage.setItem('refreshToken', RefreshToken);

                originalRequest.headers.Authorization = `Bearer ${Token}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed', refreshError);
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
