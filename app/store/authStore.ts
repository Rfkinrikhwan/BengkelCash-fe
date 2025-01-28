import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import axios from 'axios';

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

                    const response = await axios.post('/api/auth/login', {
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

                    const response = await axios.post('/api/auth/refresh', {
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

// Axios interceptor untuk handle 401 errors
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await useAuthStore.getState().refreshAccessToken();
                // Retry original request
                const originalRequest = error.config;
                originalRequest.headers['Authorization'] = `Bearer ${useAuthStore.getState().accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default useAuthStore;