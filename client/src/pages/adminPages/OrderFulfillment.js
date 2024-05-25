import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderFulfillment() {
  const isAdminLoggedIn = localStorage.getItem('userType') === 'admin';
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
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
      })
      .catch((error) => {
        console.error('Error updating order status:', error.response || error.message || error);
      });
  };

  // Function to render tables based on order status
  const renderTable = (status, statusLabel) => (
    <div>
      <h2>{statusLabel} Orders</h2>
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
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.filter(order => 
            order.products.some(product => product.orderStatus === status)
          ).map(order => 
            order.products.filter(product => product.orderStatus === status).map(product => (
              <tr key={`${order.transactionID}-${product.productID}`}>
                <td>{order.transactionID}</td>
                <td>{order.email}</td>
                <td>{order.address}</td>
                <td>{product.productID}</td>
                <td>{new Date(order.dateOrdered).toLocaleDateString()}</td>
                <td>{order.time}</td>
                <td>{product.orderQuantity}</td>
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
  );

  return (
    <div>
      <h1>Order Fulfillment</h1>
      <div>
        {isAdminLoggedIn ? (
          <>
            <button onClick={handleLogout}>Log Out</button>

            {/* render tables for each status */}
            {/* function */}
            {renderTable(0, 'Pending')}
            {renderTable(1, 'Completed')}
            {renderTable(2, 'Cancelled')}
          </>
        ) : (
          <>
            <Link to='/login'>Log in</Link>
            <Link to='/signup'>Sign up</Link>
            <p>Forbidden page</p>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderFulfillment;
