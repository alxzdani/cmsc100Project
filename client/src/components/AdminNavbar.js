import { LayoutDashboard, BookUser, ShoppingCart, ShoppingBasket, PieChart, LogOut } from 'lucide-react'

export default function AdminNavbar () {
    return (
        <div>
            <div className="">
            <div className="flex flex-col w-1/4 rounded-r-xl h-screen bg-notblack p-10">
                <h1 className="text-white">Hello, Admin!</h1>
                <div className="space-y-5">
                    <button className="border-2 bg-white bg-opacity-10 flex flex-row w-56 p-3 mx-auto rounded-lg text-white"><LayoutDashboard className="mr-2"/>Dashboard</button>
                    <button className="border-2 bg-white bg-opacity-10 flex flex-row w-56 p-3 mx-auto rounded-lg text-white"><BookUser className="mr-2"/>User Management</button>
                    <button className="border-2 bg-white bg-opacity-10 flex flex-row w-56 p-3 mx-auto rounded-lg text-white"><ShoppingCart className="mr-2"/>Product Listing</button>
                    <button className="border-2 bg-white bg-opacity-10 flex flex-row w-56 p-3 mx-auto rounded-lg text-white"><ShoppingBasket className="mr-2"/>Order Fulfilment</button>
                    <button className="border-2 bg-white bg-opacity-10 flex flex-row w-56 p-3 mx-auto rounded-lg text-white"><PieChart className="mr-2"/>Sales Report</button>
                </div>
                <div className="m-auto"></div>
                <button className="flex flex-row text-white mx-auto"><LogOut className="mr-2"/>Logout</button>
            </div>
            <div className=""></div>
            </div>
        </div>

    );
}

