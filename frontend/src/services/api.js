import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust based on your backend URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

export const setStoredUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const authAPI = {
    login: async (email, password) => {
        // Mock login for now if backend isn't ready
        // Remove this mock block when backend is ready
        if (email === "test@example.com" && password === "password") {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        token: "mock-jwt-token-12345",
                        user: { id: 1, name: "Test User", email: email }
                    });
                }, 1000);
            });
        }

        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    logout: () => {
        setAuthToken(null);
        localStorage.removeItem('user');
    }
};

export default api;
