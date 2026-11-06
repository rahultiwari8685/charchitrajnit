"use client"
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>('light');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Mark component as mounted
        setIsMounted(true);

        // Get theme from localStorage or system preference
        const getInitialTheme = (): Theme => {
            if (typeof window === 'undefined') return 'light';

            try {
                const storedTheme = localStorage.getItem('theme') as Theme;
                if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
                    return storedTheme;
                }

                // Use system preference as fallback
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                return prefersDark ? 'dark' : 'light';
            } catch (error) {
                // Fallback to light theme if there's any error
                console.warn('Error reading theme preference:', error);
                return 'light';
            }
        };

        const initialTheme = getInitialTheme();
        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    const applyTheme = (newTheme: Theme) => {
        if (typeof window === 'undefined') return;

        try {
            // Update data-theme attribute
            document.documentElement.setAttribute('data-bs-theme', newTheme);

            // Save to localStorage
            localStorage.setItem('theme', newTheme);
        } catch (error) {
            console.warn('Error applying theme:', error);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    const setThemeMode = (newTheme: Theme) => {
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    return {
        theme,
        isMounted,
        toggleTheme,
        setThemeMode,
        isDark: theme === 'dark',
        isLight: theme === 'light'
    };
};
