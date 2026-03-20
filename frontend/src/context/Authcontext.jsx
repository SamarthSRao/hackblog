import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, getCurrentUser } from '../services/api';
import { setAuthToken, setStoredUser } from '../services/api';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const response = await authAPI.getCurrentUser();
                    setUser(response.data.user);

                }
                catch (error) {
                    setLoading(false);
                    setToken(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
                setLoading(false);
            }
            else {
                setLoading(false);
            }
        }
        loadUser();
    }, [token])

    const login = async (email, password) => {
        try {


            const response = await authApi.login(email, password);
            setAuthToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    const register = async (name, email, password) => {
        try {
            const response = await authApi.register({ name, email, password });
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        catch (error) {
            console.log(error);
            throw error
        }
    }
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);

