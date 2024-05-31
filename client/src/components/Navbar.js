import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSnackbar } from '../components/SnackbarContext';
import { CircleX, CircleCheckBig, Store, ShoppingCart, ShoppingBag } from 'lucide-react'

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false); 
        navigate("/"); 
        showSnackbar(<CircleCheckBig />, "Successfully Logged Out!", `Thank you for availing our service. Please come back again!`, "emerald");
    };

    return (
        <div className="fixed top-0 z-50 bg-white h-20 w-screen px-6 flex flex-row drop-shadow-2xl place-content-center">
            <div className="m-auto flex flex-row w-screen">
                <button onClick={() => navigate('/')} className="flex items-center text-left bg-transparent border-none p-0">
                    <img src={LOGO} className="size-14 ml-6 mr-3 place-self-center" alt="Logo" />
                    <h1 className="text-notblack tracking-wide text-3xl font-bold mr-5 place-self-center">Farm ni Ville</h1>
                </button>
                {isLoggedIn === false ? [<></>
                ] : [ <div className="flex flex-row items-center space-x-4">
                    <button className="text-notgreen font-semibold flex flex-row border-white border-2 hover:border-notgreen h-fit p-2 rounded" 
                            onClick={() => {navigate("/shop")}}
                    ><Store className="mr-1"/>Shop</button>
                    <button className="text-notgreen font-semibold flex flex-row border-white border-2 hover:border-notgreen h-fit p-2 rounded" 
                            onClick={() => {navigate("/cart")}}
                    ><ShoppingCart className="mr-1" />Cart</button>
                    <button className="text-notgreen font-semibold flex flex-row border-white border-2 hover:border-notgreen h-fit p-2 rounded" 
                            onClick={() => {navigate("/manage-orders")}}
                    ><ShoppingBag className="mr-1"/>Manage Orders</button>
                </div>]
                }
                
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
                    onClick={() => {navigate("/profile");}}
                    >My Profile</button>,
                    <button className="text-notblack bg-[#C8C8C8] rounded-sm h-fit px-10 py-2"
                    onClick={handleLogout}
                    >Log Out</button>
                ]}
                    
                </div>
            </div>
        </div>
    );
}
