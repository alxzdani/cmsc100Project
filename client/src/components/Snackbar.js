import React, { useEffect } from 'react';
import { useSnackbar } from './SnackbarContext';

export default function Snackbar() {
    const { snackbar, hideSnackbar } = useSnackbar();

    useEffect(() => {
        if (snackbar) {
            const timer = setTimeout(() => {
                hideSnackbar();
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [snackbar, hideSnackbar]);

    if (!snackbar) return null;

    return (
        <div className={`fixed top-24 w-1/3 right-5 z-50 bg-white border-t-4 border-${snackbar.colour}-500 rounded-b text-${snackbar.colour}-900 px-4 py-3 shadow-md`} role="alert">
            <div className="flex">
                <div className={`py-1 text-${snackbar.colour}-500`}>{snackbar.icon}</div>
                <div className="ml-2 text-left">
                    <p className="font-bold">{snackbar.title}</p>
                    <p className="text-sm">{snackbar.message}</p>
                </div>
            </div>
        </div>
    );
}
