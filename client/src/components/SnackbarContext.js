import React, { createContext, useState, useContext } from 'react';

const SnackbarContext = createContext();

export function useSnackbar() {
    return useContext(SnackbarContext);
}

export function SnackbarProvider({ children }) {
    const [snackbar, setSnackbar] = useState(null);

    const showSnackbar = (icon, title, message, colour) => {
        setSnackbar({ icon, title, message, colour });
        setTimeout(() => {
            setSnackbar(null);
        }, 5000);
    };

    const hideSnackbar = () => {
        setSnackbar(null);
    };

    return (
        <SnackbarContext.Provider value={{ snackbar, showSnackbar, hideSnackbar }}>
            {children}
        </SnackbarContext.Provider>
    );
}
