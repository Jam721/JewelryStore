// src/context/AuthContext.jsx
// @ts-ignore
import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated } from '../services/apiService';

const AuthContext = createContext({
    isAuthenticated: false,
    setAuthenticated: (status: boolean) => {}
});

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false
    });

    useEffect(() => {
        // Проверяем аутентификацию при загрузке приложения
        setAuthState({ isAuthenticated: isAuthenticated() });
    }, []);

    const setAuthenticated = (isAuth: boolean) => {
        setAuthState({ isAuthenticated: isAuth });
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: authState.isAuthenticated,
            setAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);