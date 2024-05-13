import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BG_IMG from "../assets/farm-to-table-bg.jpg";


// there is no prompt yet if user enter valid or invalid data
// but it is working (see console)
export default function LoginPage() {
    const [users, setUsers] = useState([])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //redirect user to shop page
    const navigate = useNavigate()

    useEffect(() => {
        fetchUsers();
    }, [])

    //connect to api
    const fetchUsers = () => {
        axios
            .get('http://localhost:3001/signup')
            .then((res) => {
                //console.log(res.data)
            })
    }

    const handleLogin = async (event) => {
      event.preventDefault();
      try {
          const response = await axios.post('http://localhost:3001/login', { email, password })
          const { token, redirectTo } = response.data
          
          if (redirectTo === '/admin-dashboard') {
              alert('Login Successful as Admin')
          } else {
              alert('Login Successful as Customer')
          }
          fetchUsers();
          setEmail('')
          setPassword('')
          localStorage.setItem('token', token)
          navigate(redirectTo)  //redirect to shopping page or admin dashboard
      } catch (error) {
          console.log('Login Error')
      }
  }
  




    return (
        <div style={{
            backgroundImage: `url(${BG_IMG})`,
            backgroundSize: 'cover',
            backgroundPosition: '-20% center',  // More to the right
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}
            id="top">
            <Navbar />
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '45vw',  // Half the width of the viewport
                height: '100vh',  // Same height as the background image
                backgroundColor: 'white',  // White box
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 0 10px rgba(0, 0, 0, 0.5)'  // Optional: adds a shadow for better separation
            }}>
                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <br />
                    <input type='text' placeholder='Enter email'
                        value={email} onChange={(e) => setEmail(e.target.value)} />

                    <br />

                    <label>Password</label>
                    <br />
                    <input type='password' placeholder='Enter password'
                        value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button type='submit'> Log in </button>
                </form>
            </div>
        </div>
    );
}