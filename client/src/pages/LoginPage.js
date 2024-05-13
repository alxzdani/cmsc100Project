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
    const [showPassword, setShowPassword] = useState(false);

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
            backgroundPosition: '-20% center',  // move to right
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
                width: '45vw',  // half the width of the viewport
                height: '100vh',  // same height as the background image
                backgroundColor: '#d1d5db',  // White box
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 0 10px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{
                    width: '80%',  // 80% of the parent container's width
                    height: '70%',  // 70% of the parent container's height
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    <h1 style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>Log in</h1>
                    <p style={{ textAlign: 'center', marginBottom: '10px' }}>
                        Enter your details to login to your account
                    </p>
                    <form onSubmit={handleLogin}>
                        <br />
                        <input type='text' placeholder='Enter email' className="rounded-lg px-4 py-2 border-2 border-gray-300 w-full"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        <br />
                        <br />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type={showPassword ? 'text' : 'password'} placeholder='Passcode' className="rounded-lg px-4 py-2 flex-grow border-2 border-gray-300"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ marginLeft: '10px' }}>
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <br />
                        <button type='submit' style={{
                            backgroundColor: 'green', color: 'white', fontWeight: 'bold',
                            padding: '10px 20px', borderRadius: '5px', border: 'none',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            Log in
                        </button>
                        <p style={{ marginTop: '20px', textAlign: 'center' }}>
                            Don't have an account yet? <a href="/signup" style={{ color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>Register Now</a>
                        </p>
                    </form>
                </div>
            </div>
        </div >
    );
}