import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { OrderTransaction } from '../backend/models/orderTransaction';
import Forbidden from "../components/Forbidden"


export default function ProfilePage(){
    const isUserLogIn = localStorage.getItem('token')
    const [user, setUser] = useState()
    const navigate = useNavigate()

    useEffect(() => { // if user not log in redirect them to login page
        if (!isUserLogIn) {
            navigate('/login');
        } else {
            getUser();
        }
    }, [isUserLogIn, navigate]);

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
            <>
            <p>Profile</p>
            <p>Full Name: {user.fname} {user.mname} {user.lname}</p>
            <p>Email: {user.email}</p>
            </>
        )
    } else {
        return (
            <Forbidden />
        )
    }

}