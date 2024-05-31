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
            <div className="bg-gradient-to-r from-lightgreen to-emerald-500 h-screen">
            <Navbar />
            <div className="pt-32 flex flex-row">
                <div className="bg-white shadow-lg rounded-lg w-fit p-20 mx-auto">
                    <h1 className="text-3xl mb-10 font-bold">Profile</h1>
                    <CircleUserRound className="size-40 mx-auto mb-10"/>
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