import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import BG_IMG from "../assets/bg.jpg";
import { useSnackbar } from '../components/SnackbarContext';
import { CircleX, CircleCheckBig } from 'lucide-react'

function SignUp() {
  const [user, setUsers] = useState([])
  const [fname, setFname] = useState('')
  const [mname, setMname] = useState('')
  const [lname, setLname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { showSnackbar } = useSnackbar();

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
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    event.preventDefault() 
    if(fname == "" || lname == "" || email == "" || password == ""){
      showSnackbar(<CircleX />, `Invalid Input!`, `Please check all required fields.`, "teal");
      return
    }     
    if(password.length < 8){
      showSnackbar(<CircleX />, `Weak Password!`, `Password has to be longer than 8 characters.`, "teal");
      return
    }  
    if(!emailPattern.test(email)){
      showSnackbar(<CircleX />, `Error!`, `Please enter a valid email address.`, "teal");
      return
    }  // preventing the page to refresh
    axios
      .post('http://localhost:3001/signup', { fname, mname, lname, email, password })
      .then(() => {
        showSnackbar(<CircleCheckBig />, `All Set!`, `You have successfully created an account.`, "teal");
        setFname('')
        setMname('')
        setLname('')
        setEmail('')
        setPassword('')
        fetchUsers()
        navigate('/login')
      })
      .catch((error) => {
        showSnackbar(<CircleX />, `Error!`, `Please check all of the required fields.`, "teal");
        console.log('Unable to create an account')
      })
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };


  return (
    <div style={{
      backgroundImage: `url(${BG_IMG})`,
      backgroundSize: 'cover',
      backgroundPosition: '-20% center',
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
        width: '45vw',
        height: '100vh',
        backgroundColor: '#d1d5db',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          marginTop: 70,
          width: '80%',
          height: '80%',
          backgroundColor: 'white',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>Sign Up</h1>
          <p style={{ textAlign: 'center', marginBottom: '10px' }}>
            Enter your details to sign up for an account
          </p>
          <form onSubmit={handleRegister} style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '20px' }}>
              <input type='text' placeholder='Enter First Name *' className="rounded-lg px-4 py-2 border-2 border-gray-300 w-full"
                value={fname} onChange={(e) => setFname(e.target.value)} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input type='text' placeholder='Enter Middle Name' className="rounded-lg px-4 py-2 border-2 border-gray-300 w-full"
                value={mname} onChange={(e) => setMname(e.target.value)} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input type='text' placeholder='Enter Last Name *' className="rounded-lg px-4 py-2 border-2 border-gray-300 w-full"
                value={lname} onChange={(e) => setLname(e.target.value)} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input type='text' placeholder='Enter Email *' className="rounded-lg px-4 py-2 border-2 border-gray-300 w-full"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex flex-row" style={{ marginBottom: '20px' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder='Enter Password *' className="rounded-lg px-4 py-2 border-2 border-gray-300 w-full"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ marginLeft: '10px' }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex flex-row" >
              <input type={showPassword ? 'text' : 'password'} 
              placeholder='Confirm Password *' 
              className="rounded-lg px-4 py-2 border-2 border-gray-300 w-full"
                value={confirmPassword} 
                onChange={handleConfirmPasswordChange} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ marginLeft: '10px' }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {!passwordsMatch && (
              <p className="text-red-500 m-4">Passwords do not match</p>
            )}

            <button type='submit' 
              className="mt-5"
              style={{
              backgroundColor: 'notgreen', color: 'white', fontWeight: 'bold',
              padding: '10px 20px', borderRadius: '5px', border: 'none',
              width: '100%', boxSizing: 'border-box'
            }}> Sign Up </button>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
              Already have an account? <a href="/login" style={{ color: 'black', fontWeight: 'bold', textDecoration: 'none' }}>Log in</a>
            </p>
          </form>

        </div>
      </div>
    </div>
  )
}

export default SignUp
