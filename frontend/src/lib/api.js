// API base URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // Important for session cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

// Authentication API
export const authAPI = {
    register: (username, password, role) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, role }),
        }),

    login: (username, password) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),

    logout: () =>
        apiRequest('/auth/logout', {
            method: 'POST',
        }),

    getCurrentUser: () => apiRequest('/auth/me'),

    changePassword: (currentPassword, newPassword) =>
        apiRequest('/auth/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        }),

    changeUsername: (newUsername) =>
        apiRequest('/auth/username', {
            method: 'PUT',
            body: JSON.stringify({ newUsername }),
        }),

    deleteAccount: () =>
        apiRequest('/auth/account', {
            method: 'DELETE',
        }),
};

// Questions API
export const questionsAPI = {
    getAll: () => apiRequest('/questions'),

    getById: (id) => apiRequest(`/questions/${id}`),

    create: (title, content, tags) =>
        apiRequest('/questions', {
            method: 'POST',
            body: JSON.stringify({ title, content, tags }),
        }),

    delete: (id) =>
        apiRequest(`/questions/${id}`, {
            method: 'DELETE',
        }),
};

// Answers API
export const answersAPI = {
    create: (questionId, content) =>
        apiRequest('/answers', {
            method: 'POST',
            body: JSON.stringify({ questionId, content }),
        }),

    markAsAccepted: (answerId) =>
        apiRequest(`/answers/${answerId}/accept`, {
            method: 'PUT',
        }),
};
