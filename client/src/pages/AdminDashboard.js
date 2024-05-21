import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import AdminNavbar from "../components/AdminNavbar"

function Dashboard() {
    const isAdminLogIn = localStorage.getItem('userType') === 'admin';

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }


  return (
    <div>
        <div>
           <AdminNavbar />

          </div>
            {isAdminLogIn  ? ( // if the user is signed in we want to render out signout button
                <>
                <Link to='/product-listing'> <li>Product Listing</li> </Link>
                <Link to='/user-management'> <li>User Management</li> </Link>
                <Link to='/sales-report'> <li>Sales Report</li> </Link>
                <Link to='/order-fulfillment'> <li>Order Fulfillment</li> </Link>
                <br/>
                <li><button onClick={handleLogout}> Log Out</button></li>
                </>
            ): (
                //if they are not logged in
                
                <>
                <Link to= '/login'><li>Log in</li></Link>
                <Link to = '/signup'><li>Sign up</li></Link>

                <p>forbidden page</p>
                </>
            )}
        </div>

   
  )
}

export default Dashboard
