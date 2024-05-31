import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { OrderTransaction } from '../backend/models/orderTransaction';
import Forbidden from "../components/Forbidden"
import Navbar from "../components/Navbar"
import { CircleUserRound } from 'lucide-react'


export default function ProfilePage(){
    const isUserLogIn = localStorage.getItem('token')
    const [user, setUser] = useState()
    const navigate = useNavigate()

    const capitalize = (str) => {
        if (typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

    // useEffect(() => { // if user not log in redirect them to login page
    //     if (!isUserLogIn) {
    //         navigate('/login');
    //     } else {
    //         getUser();
    //     }
    // }, [isUserLogIn, navigate]);

    const getUser= () => {
        axios.get('http://localhost:3001/cart', { params: { token: isUserLogIn } })
        .then((res) => {
            setUser(res.data.user)
            console.log(user)
        })
        .catch((error) => {
            console.error(error.response.data);
        });
    }
    if (user != null) {
        return(
            <div className="bg-lightgreen h-screen">
            <Navbar />
            <div className="pt-32 flex flex-row">
                <div className="bg-white border-2 border-notgreen shadow-lg rounded-lg w-fit p-20 mx-auto">
                    <h1 className="text-3xl mb-10 font-bold">Profile</h1>
                    {/* <CircleUserRound className="size-40 mx-auto mb-10"/> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10AB4E" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-notgreen size-40 mx-auto mb-10 lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
                    <p className="my-2">Name: {capitalize(user.fname)} {capitalize(user.mname)} {capitalize(user.lname)}</p>
                    <p>Email: {user.email}</p>
                </div>
                {/* <div className="bg-white shadow-lg rounded-lg w-fit p-20 mx-auto">
                    <h1 className="text-3xl">Orders</h1>
                </div> */}
            </div>
            </div>
        )
    } else {
        return (
            <Forbidden />
        )
    }

}