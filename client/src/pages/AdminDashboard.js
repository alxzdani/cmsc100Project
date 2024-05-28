import React, { useState } from 'react'
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
    const [navbarOpen, setNavbarOpen] = useState(false);

    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    };
    
    return (
    <div>
        <div>
          </div>
            {isAdminLogIn  ? ( // if the user is signed in we want to render out signout button
                <>
                <div className="flex flex-row">
                    <div className={`${navbarOpen  ? 'w-1/4' : 'w-20'} transition-all duration-500 overflow-hidden`}>
                        <AdminNavbar navbarOpen={navbarOpen} toggleNavbar={toggleNavbar} isDashboard={true}/>
                    </div>
                    
                    <div className={`${navbarOpen  ? 'w-3/4' : 'w-11/12'} transition-all duration-500`}>
                        <div className={`${navbarOpen  ? 'w-11/12' : 'w-[92%]'} mx-auto mt-10`}>
                            <h1 className="text-3xl text-green border-b-2 font-semibold border-green pb-5 text-left">Dashboard</h1>
                        </div>
                        <div className="grid gap-12 grid-cols-2 grid-cols-2 p-12 mx-auto">
                            <button className="h-60 rounded-lg relative" onClick={() => navigate("/user-management")}>
                                <img src={USER} className="" />
                                <span className="absolute bottom-[10%] right-[30%] z-10 bg-[#858585] text-white p-2 w-48 rounded-lg opacity-80">User Management</span>
                            </button>
                            <button className="h-60 rounded-lg relative" onClick={() => navigate("/product-listing")}>
                                <img src={PRODUCT} className=""/>
                                <span className="absolute bottom-[10%] right-[30%] z-10 bg-[#858585] text-white p-2 w-48 rounded-lg opacity-80">Product Listing</span></button>
                            <button className="h-60 rounded-lg relative" onClick={() => navigate("/order-fulfillment")}>
                                <img src={ORDER} className=""/>
                                <span className="absolute bottom-[10%] right-[30%] z-10 bg-[#858585] text-white p-2 w-48 rounded-lg opacity-80">Order Fulfillment</span></button>
                            <button className="h-60 rounded-lg relative" onClick={() => navigate("/sales-report")}>
                                <img src={SALES} className=""/>
                                <span className="absolute bottom-[10%] right-[30%] z-10 bg-[#858585] text-white p-2 w-48 rounded-lg opacity-80">Sales Report</span></button>
                        
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
