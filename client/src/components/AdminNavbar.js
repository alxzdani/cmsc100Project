import { LayoutDashboard, BookUser, ShoppingCart, ShoppingBasket, PieChart, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LOGO from "../assets/logo.png";

export default function AdminNavbar () {
    const isAdminLogIn = localStorage.getItem('userType') === 'admin';

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div>
            <div className="z-50">
            <div className="flex flex-col rounded-r-xl h-screen bg-notblack p-10">
                <div className="">
                    <img src={LOGO} className="size-48 rounded-lg p-5 mx-auto bg-white" alt="Logo" />
                    <h1 className="text-2xl text-lime my-5">Hello, Admin!</h1>
                </div>
               
                <div className="space-y-5">
                    <button onClick={() => navigate("/admin-dashboard")} className="bg-white bg-opacity-10 flex flex-row w-11/12 p-3 mx-auto rounded-lg text-white"><LayoutDashboard className="mr-2"/>Dashboard</button>
                    <button onClick={() => navigate("/product-listing")} className="bg-white bg-opacity-10 flex flex-row w-11/12 p-3 mx-auto rounded-lg text-white"><BookUser className="mr-2"/>User Management</button>
                    <button onClick={() => navigate("/user-management")} className="bg-white bg-opacity-10 flex flex-row w-11/12 p-3 mx-auto rounded-lg text-white"><ShoppingCart className="mr-2"/>Product Listing</button>
                    <button onClick={() => navigate("/order-fulfillment")} className="bg-white bg-opacity-10 flex flex-row w-11/12 p-3 mx-auto rounded-lg text-white"><ShoppingBasket className="mr-2"/>Order Fulfilment</button>
                    <button onClick={() => navigate("/sales-report")} className="bg-white bg-opacity-10 flex flex-row w-11/12 p-3 mx-auto rounded-lg text-white"><PieChart className="mr-2"/>Sales Report</button>
                </div>
                
                <div className="m-auto"></div>
                <button className="flex flex-row text-white ml-5" onClick={handleLogout}><LogOut className="mr-2"/>Logout</button>
            </div>
            <div className=""></div>
            </div>
        </div>

    );
}

