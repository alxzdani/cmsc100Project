import React, { useEffect } from 'react'

export default function Snackbar({ icon, title, message, colour, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return(
        <div class={`mt-10 bg-white border-t-4 border-${colour}-500 rounded-b px-4 py-3 shadow-md`} role="alert">
            <div class="flex">
                <div class={`py-1 text-${colour}-500`}>{ icon }</div>
                <div>
                <p class="font-bold">{ title }</p>
                <p class="text-sm">{ message }</p>
                </div>
            </div>
        </div>
    )
}