import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

function ShopPage() {
    const isUserLogIn = !!localStorage.getItem('token')
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }


  return (
    <div>
      Shopping Page


        <div>
            {isUserLogIn ? ( // if the user is signed in we want to render out signout button
                <>
                <Link to='/shop'> <li>Shop</li> </Link>
                <li><button onClick={handleLogout}> Log Out</button></li>
                </>
            ): (
                //if they are not logged in
                <>
                <Link to= '/login'><li>Log in</li></Link>
                <Link to = '/signup'><li>Sign up</li></Link>
                </>
            )}
        </div>

    </div>

   
  )
}

export default ShopPage
