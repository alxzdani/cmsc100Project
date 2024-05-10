import React from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div>
      <Link to = '/'><h1>Landing Page</h1></Link>
      <ul>
        <Link to= '/login'><li>Log in</li></Link>
        <Link to = '/signup'><li>Sign up</li></Link>
      </ul>
    </div>
  )
}

export default LandingPage
