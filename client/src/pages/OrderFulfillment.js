import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Forbidden from "../components/Forbidden"
import AdminNavbar from '../components/AdminNavbar'
import { useSnackbar } from '../components/SnackbarContext';
import { CircleX, CircleCheckBig } from 'lucide-react'

function OrderFulfillment() {
  const isAdminLoggedIn = localStorage.getItem('userType') === 'admin';
  const [orders, setOrders] = useState([]);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders from the database
  const fetchOrders = async () => {
    console.log('Fetching orders...');

    try {
      const res = await axios.get('http://localhost:3001/order-fulfillment');
      console.log('Fetched orders:', res.data.orders);
      // Update state with the orders
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error.response || error.message || error);
    }
  };

  // Update order status
  const updateOrderStatus = (transactionID, productID, newStatus) => {
    console.log(`Updating status for transactionID: ${transactionID}, productID: ${productID} to ${newStatus}`);
    axios
      .put(`http://localhost:3001/order-fulfillment/${transactionID}/${productID}`, {
        currentStatus: newStatus,
      })
      .then((res) => {
        console.log('Update response:', res);
        // Refresh state to update the rendered status on the UI
        fetchOrders(); 
        if(newStatus === 1){
          showSnackbar(<CircleCheckBig />, "Product Shipped!", `The product is now on its way to the customer!`, "teal");
        }
        else if(newStatus === 2){
          showSnackbar(<CircleCheckBig />, "Order Canceled!", `The customer's order has been canceled successfully.`, "teal");
        }
      })
      .catch((error) => {
        console.error('Error updating order status:', error.response || error.message || error);
        showSnackbar(<CircleX />, "Error!", `An error was encountered while updating the order's status.`, "teal");
      });
  };

  // Function to render tables based on order status
  const renderTable = (status, statusLabel) => (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{statusLabel} Orders</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Transaction ID</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Product ID</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date Ordered</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Time Ordered</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Mode of Payment</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Order Quantity</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Order Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.filter(order => 
            order.products.some(product => product.orderStatus === status)
          ).map(order => 
            order.products.filter(product => product.orderStatus === status).map(product => (
              <tr key={`${order.transactionID}-${product.productID}`}>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">{order.transactionID}</td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">{order.email}</td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">{order.address}</td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">{product.productID}</td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">{new Date(order.dateOrdered).toLocaleDateString()}</td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">{order.time}</td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">{order.modeOfTransaction}</td>
                <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">{product.orderQuantity}</td>
                <td>
                  {/* Show text instead of dropdown for completed or cancelled orders */}
                  {status === 1 ? (
                    <span>Completed</span>
                  ) : status === 2 ? (
                    <span>Cancelled</span>
                  ) : (
                    <select
                      value={product.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(order.transactionID, product.productID, parseInt(e.target.value))
                      }
                    >

                      {/* dropdown for changing status */}
                      <option value={0}>Pending</option>
                      <option value={1}>Completed</option>
                      <option value={2}>Cancelled</option>
                    </select>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );

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
                  <h1 className="text-3xl text-green border-b-2 font-semibold border-green pb-5 text-left">Order Fulfillment</h1>
                  
                </div>
                <div className="my-5">
                  {renderTable(0, 'Pending')}
                  {renderTable(1, 'Completed')}
                  {renderTable(2, 'Cancelled')}
                </div>
                </div>
              </div>

            {/* render tables for each status */}
            {/* function */}
            
          </>
        ) : (
          <>
            <Forbidden />
          </>
        )}
    </>
  );
}

export default OrderFulfillment;
