import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor to handle 401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized - clear token and maybe redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
            // Optional: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

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

// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

export const commentsApi = {
    getPost: (postId) => api.get(`/comments/${postId}`),
    createComment: (commentData) => api.post('/comments', commentData)
}
export const storiesApi = {
    getStories: () => api.get('/stories'),
    getById: (storyId) => api.get(`/stories/${storyId}`),
    createStory: (storyData) => api.post('/stories', storyData)
}
export const userApi = {
    getUserProfile: (userId) => api.get(`/users/${userId}`),
}
export default api;
