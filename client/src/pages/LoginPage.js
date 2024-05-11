import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// there is no prompt yet if user enter valid or invalid data
// but it is working (see console)
export default function LoginPage() {
    //const [users, setUsers] = useState([])
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

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
    <div>
      <div>
        <form onSubmit={handleLogin}>

            <label>Email</label>
            <br/>
            <input type= 'text' placeholder='Enter email'
            value = {email} onChange={(e) => setEmail(e.target.value)}/>

            <br/>

            <label>Password</label>
            <br/>
            <input type= 'password' placeholder='Enter password'
            value = {password} onChange={(e) => setPassword(e.target.value)}/>
            

            <button type='submit'> Log in </button>

        </form>

      </div>
  
    </div>
  )
}