import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false); 
        navigate("/"); 
    };

    return (
        <div className="fixed top-0 z-50 bg-white h-20 w-screen px-6 flex flex-row drop-shadow-2xl place-content-center">
            <div className="m-auto flex flex-row w-screen">
                <button onClick={() => navigate('/')} className="flex items-center text-left bg-transparent border-none p-0">
                    <img src={LOGO} className="size-14 ml-6 mr-3 place-self-center" alt="Logo" />
                    <h1 className="text-notblack tracking-wide text-3xl font-bold mr-5 place-self-center">Farm-to-table</h1>
                </button>
                <div className="m-auto flex flex-auto">
                    {/* empty space */}
                </div>
                <div className="mr-6 flex flex-row place-items-center">
                {isLoggedIn === false ? [
                    <button className="text-white bg-notblack rounded-sm h-fit py-2 px-10 mr-5" 
                        onClick={() => {navigate("/signup");}}
                        >Sign Up</button>,
                    <button className="text-notblack bg-[#C8C8C8] rounded-sm h-fit px-10 py-2"
                        onClick={() => {navigate("/login");}}
                        >Log In</button>
                 ] : [
                    <button className="text-white bg-notblack rounded-sm h-fit py-2 px-10 mr-5" 
                    onClick={() => {navigate("/cart");}}
                    >Cart</button>,
                    <button className="text-white bg-notblack rounded-sm h-fit py-2 px-10 mr-5" 
                    onClick={() => {navigate("/manage-orders");}}
                    >Manage Orders</button>,
                    <button className="text-notblack bg-[#C8C8C8] rounded-sm h-fit px-10 py-2"
                    onClick={handleLogout}
                    >Log Out</button>
                ]}
                    
                </div>
            </div>
        </div>
    );
}
