import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from "../components/AdminNavbar"
import Forbidden from "../components/Forbidden"
import ORDER from "../assets/order.png";
import PRODUCT from "../assets/product.png";
import SALES from "../assets/sales.png";
import USER from "../assets/user.png";

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
          </div>
            {isAdminLogIn  ? ( // if the user is signed in we want to render out signout button
                <>
                <div className="flex flex-row">
                    <div className="w-1/4">
                    <AdminNavbar />
                    </div>
                    
                    <div className="w-3/4">
                        <div className="w-11/12 mx-auto mt-10">
                            <h1 className="text-3xl text-green border-b-2 font-semibold border-green pb-5 text-left">Dashboard</h1>
                        </div>
                        <div className="grid gap-12 grid-cols-2 grid-cols-2 p-12 mx-auto">
                            <button className="h-60 rounded-lg">
                                <img src={USER} className="" />
                                <span className="ml-56 z-50 bg-[#858585] text-white p-2 w-48 rounded-lg mix-blend-multiply">User Management</span></button>
                            <button className="h-60 rounded-lg">
                                <img src={PRODUCT} className=""/>
                                <span className="ml-40  bg-[#858585] text-white p-2 w-48 rounded-lg mix-blend-multiply">Product Listing</span></button>
                            <button className="h-60 rounded-lg">
                                <img src={ORDER} className=""/>
                                <span className="ml-40  bg-[#858585] text-white p-2 w-48 rounded-lg mix-blend-multiply">Order Management</span></button>
                            <button className="h-60 rounded-lg">
                                <img src={SALES} className=""/>
                                <span className="ml-40  bg-[#858585] text-white p-2 w-48 rounded-lg mix-blend-multiply">Sales Report</span></button>
                        
                        </div>
                    </div>
                </div>
                </>
            ) : (
                //if they are not logged in
                <>
                <Forbidden />
                </>
            )}
        </div>

   
  )
}

export default Dashboard
