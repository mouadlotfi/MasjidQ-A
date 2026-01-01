import { writable } from 'svelte/store';

// Check for saved theme preference or default to dark
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : 'dark';
const initialTheme = storedTheme || 'dark';

// Create theme store
export const theme = writable(initialTheme);

// Apply theme to document
if (typeof window !== 'undefined') {
    theme.subscribe(value => {
        if (value === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', value);
    });

    // Apply initial theme
    if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

// Toggle theme function
export function toggleTheme() {
    theme.update(current => current === 'dark' ? 'light' : 'dark');
}
