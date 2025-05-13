import { AuthContext } from '@/provider/AuthProvider';
import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
    baseURL: "https://sugarytestapi.azurewebsites.net",
});

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const context = useContext(AuthContext)

    axiosSecure.interceptors.request.use(
        (config) => {
            const token = getAccessToken();
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosSecure.interceptors.response.use(
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
                    return axiosSecure(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed', refreshError);
                    localStorage.clear();
                    context?.Logout()
                    navigate("/login");
                }
            }

            return Promise.reject(error);
        })
    return axiosSecure
};

export default useAxiosSecure;