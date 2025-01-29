import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import axios from 'axios';
import { axiosConfig } from '~/config/axios';

// Define types
interface User {
    id: string;
    email: string;
    name: string;
    // tambahkan field user lainnya sesuai kebutuhan
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
}

// Create auth store
const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response = await axiosConfig.post('/api/login', {
                        email,
                        password,
                    });

                    const { user, accessToken, refreshToken } = response.data;

                    // Simpan tokens ke cookies
                    Cookies.set('accessToken', accessToken, { expires: 1 }); // expires in 1 day
                    Cookies.set('refreshToken', refreshToken, { expires: 7 }); // expires in 7 days

                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Login failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                // Hapus cookies
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');

                // Reset state
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            refreshAccessToken: async () => {
                try {
                    const refreshToken = get().refreshToken;

                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }

                    const response = await axiosConfig.post('/api/refresh', {
                        refreshToken,
                    });

                    const { accessToken: newAccessToken } = response.data;

                    // Update cookie dengan token baru
                    Cookies.set('accessToken', newAccessToken, { expires: 1 });

                    set({
                        accessToken: newAccessToken,
                        error: null,
                    });

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Token refresh failed',
                        isAuthenticated: false,
                    });
                    // Jika refresh gagal, logout user
                    get().logout();
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage', // nama untuk localStorage
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Axios request interceptor
axiosConfig.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;

        // Jika ada access token, tambahkan ke header
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Tambahkan header default lainnya jika diperlukan
        config.headers['Content-Type'] = 'application/json';

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios response interceptor untuk handle 401 errors
axiosConfig.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Cek jika error adalah 401 dan request belum di-retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // Tandai bahwa request sedang di-retry

            try {
                await useAuthStore.getState().refreshAccessToken();
                // Update token di header dan retry request
                originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                // Jika refresh token gagal, user akan di-logout di refreshAccessToken
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default useAuthStore;