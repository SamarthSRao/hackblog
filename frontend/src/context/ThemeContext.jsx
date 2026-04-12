import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '../constants/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('theme') || 'neonLight';
    });

    useEffect(() => {
        localStorage.setItem('theme', currentTheme);
        // Apply theme variables to root for CSS to use
        const theme = themes[currentTheme];
        const root = document.documentElement;
        
        root.style.setProperty('--bg-color', theme.bg);
        root.style.setProperty('--header-color', theme.header);
        root.style.setProperty('--text-color', theme.text);
        root.style.setProperty('--link-color', theme.link);
        root.style.setProperty('--subtext-color', theme.subtext);
        root.style.setProperty('--accent-color', theme.accent);
        
        document.body.style.backgroundColor = theme.bg;
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
