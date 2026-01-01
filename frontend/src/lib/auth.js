import { writable } from 'svelte/store';
import { authAPI } from './api';

// Create a writable store for the current user
function createAuthStore() {
    const { subscribe, set, update } = writable(null);

    return {
        subscribe,

        // Set the current user
        setUser: (user) => set(user),

        // Clear the current user
        clearUser: () => set(null),

        // Check if user is authenticated
        isAuthenticated: () => {
            let user = null;
            subscribe(u => user = u)();
            return user !== null;
        },

        // Initialize auth state by checking with server
        init: async () => {
            try {
                const data = await authAPI.getCurrentUser();
                set(data.user);
                return data.user;
            } catch (error) {
                set(null);
                return null;
            }
        },

        // Login
        login: async (username, password) => {
            const data = await authAPI.login(username, password);
            set(data.user);
            return data.user;
        },

        // Register
        register: async (username, password, role) => {
            await authAPI.register(username, password, role);
            // After registration, login automatically
            return await authStore.login(username, password);
        },

        // Logout
        logout: async () => {
            await authAPI.logout();
            set(null);
        },
    };
}

export const authStore = createAuthStore();
