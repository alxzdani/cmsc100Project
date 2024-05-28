import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Forbidden from "../components/Forbidden"
import AdminNavbar from '../components/AdminNavbar'

function SalesReport() {
  const isAdminLoggedIn = localStorage.getItem('userType') === 'admin';
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState({ weekly: {}, monthly: {}, annually: {} });
  const [period, setPeriod] = useState('weekly'); // default to weekly
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  useEffect(() => {
    fetchOrders(period);  // fetch orders for the selected period
    fetchSalesData('weekly');
    fetchSalesData('monthly');
    fetchSalesData('annually');
  }, [period]);

  const fetchOrders = async (period) => {
    try {
      //passed the period as the parameter that you want to get
      const res = await axios.get(`http://localhost:3001/orders?period=${period}`);  // fetch orders for the selected period
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error.response || error.message || error);
    }
  };


  // get sales
  // total sales and total quantity
  const fetchSalesData = async (period) => {
    try {
      const res = await axios.get(`http://localhost:3001/sales-report?period=${period}`);
      setSalesData(prevData => ({ ...prevData, [period]: res.data }));
    } catch (error) {
      console.error(`Error fetching ${period} sales data:`, error.response || error.message || error);
    }
  };

  return (
    <>
        {isAdminLoggedIn ? (
          <>
            <div className="flex flex-row">
              <div className={`${navbarOpen  ? 'w-1/4' : 'w-20'} transition-all duration-500 overflow-hidden`}>
                <AdminNavbar navbarOpen={navbarOpen} toggleNavbar={toggleNavbar} isDashboard={false}/>
              </div>
              <div className={`${navbarOpen  ? 'w-3/4' : 'w-11/12'} h-screen transition-all duration-500 p-12 text-left`}>
                <div className={`w-full mx-auto`}>
                  <h1 className="text-3xl text-green border-b-2 font-semibold border-green pb-5 text-left">Sales Report</h1>
                  
                </div>
                <div className="my-5">
                <div>

              {/* button for choosing which period of sales report to view */}
              {/* period == weekly which is default */}
              <button onClick={() => setPeriod('weekly')}>Weekly</button> 

              {/* period == monthly */}
              <button onClick={() => setPeriod('monthly')}>Monthly</button>

              {/* period == annually */}
              <button onClick={() => setPeriod('annually')}>Annual</button>
            </div>


            {/* Text sa taas like showing what period */}
            <h2>{period.charAt(0).toUpperCase() + period.slice(1)} Sales</h2> 

            {/* total sales and total quantity for that period */}
            <p>Total Sales: {(salesData[period]?.totalSales || 0).toFixed(2)}</p>
            <p>Total Quantity Sold: {salesData[period]?.totalQuantity || 0}</p>

            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Product ID</th>
                  <th>Date Ordered</th>
                  <th>Time Ordered</th>
                  <th>Order Quantity</th>

                  {/* optional ilagay */}
                  <th>Order Status</th> 
                </tr>
              </thead>
              <tbody>
                {orders.map(order =>
                  order.products
                    .filter(product => product.orderStatus === 1)
                    .map(product => (
                      <tr key={`${order.transactionID}-${product.productID}`}>
                        <td>{order.transactionID}</td>
                        <td>{order.email}</td>
                        <td>{order.address}</td>
                        <td>{product.productID}</td>
                        <td>{new Date(order.dateOrdered).toLocaleDateString()}</td>
                        <td>{order.time}</td>
                        <td>{product.orderQuantity}</td>
                        <td>{product.orderStatus}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
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
    </>
  );
}

export default SalesReport;
