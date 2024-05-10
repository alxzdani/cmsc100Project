import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const [user, setUsers] = useState([])
    const[fname, setFname] = useState('')
    const[mname, setMname] = useState('')
    const[lname, setLname] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

    //redirect user to login page after signing up
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

    //handle submit

    const handleRegister = (event) => {
        event.preventDefault()          // preventing the page to refresh
        axios
        .post('http://localhost:3001/signup', { fname, mname, lname, email, password })
        .then(() => {
            alert('Registration Successful')
            setFname('')
            setMname('')
            setLname('')
            setEmail('')
            setPassword('')
            fetchUsers()
            navigate('/login')
        })
        .catch((error) => {
            console.log('Unable to create an account')
        })
    }


  return (
    <div>
      <div>
        <form onSubmit={handleRegister}>

            <label>Firstname*</label>
            <br/>

            {/* grab whatever user is filling out */}
            <input type= 'text' placeholder='Enter Firstname' 
            value = {fname} onChange={(e) => setFname(e.target.value)}/>

            <br/>

            <label>Middlename</label>
            <br/>
            <input type= 'text' placeholder='Enter Middlename'
            value = {mname} onChange={(e) => setMname(e.target.value)}/>

            <br/>

            <label>Lastname</label>
            <br/>
            <input type= 'text' placeholder='Enter lastname'
            value = {lname} onChange={(e) => setLname(e.target.value)}/>

            <br/>

            <label>Email</label>
            <br/>
            <input type= 'text' placeholder='Enter email'
            value = {email} onChange={(e) => setEmail(e.target.value)}/>

            <br/>

            <label>Password</label>
            <br/>
            <input type= 'password' placeholder='Enter password'
            value = {password} onChange={(e) => setPassword(e.target.value)}/>
            

            <button type='submit'> Sign Up </button>

        </form>

      </div>
  
    </div>
  )
}

export default SignUp
