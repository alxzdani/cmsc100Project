import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderFulfillment() {
  const isAdminLoggedIn = localStorage.getItem('userType') === 'admin';
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  // fetch all orders in the DB
  const fetchOrders = async () => {
    console.log('Fetching orders...');

    try {
      const res = await axios.get('http://localhost:3001/order-fulfillment');

      console.log('Fetched orders:', res.data.orders);

      //update state with the orders
      setOrders(res.data.orders);

    } catch (error) {
      console.error('Error fetching orders:', error.response || error.message || error);
    }
  };


  //update order status 
  // it accepts param of transactionID, productID, newStatus
  const updateOrderStatus = (transactionID, productID, newStatus) => {
    console.log(`Updating status for transactionID: ${transactionID}, productID: ${productID} to ${newStatus}`);
    axios

      // transactionID and productID are route parametes sent to app.put for updating values
      .put(`http://localhost:3001/order-fulfillment/${transactionID}/${productID}`, {
        orderStatus: newStatus,
      })
      .then((res) => {
        console.log('Update response:', res);

        //refresh state to update the rendered status on the UI
        fetchOrders(); 
      })
      .catch((error) => {
        console.error('Error updating order status:', error.response || error.message || error);
      });
  };

  return (
    <div>
      <h1>Order Fulfillment</h1>
      <div>
        {isAdminLoggedIn ? (
          <>
            <button onClick={handleLogout}>Log Out</button>

            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Email</th>
                  <th>Product ID</th>
                  <th>Date Ordered</th>
                  <th>Time Ordered</th>
                  <th>Order Quantity</th>
                  {/* <th>Order Status</th> */}
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>

                {/* map through orders */}
                {orders.map((order) =>
                  order.products.map((product) => (
                    <tr key={`${order.transactionID}-${product.productID}`}>
                      <td>{order.transactionID}</td>
                      <td>{order.email}</td>
                      <td>{product.productID}</td>

                      {/* convert to date format */}
                      <td>{new Date(order.dateOrdered).toLocaleDateString()}</td> 
                      <td>{order.time}</td>
                      <td>{product.orderQuantity}</td>
                      
                      {/* bahala na kayo dito frontend kung ikekeep niyo HAHA thank u so much po */}
                      {/* this shows yung orderStatus na number */}
                      {/* <td>{product.orderStatus}</td> */}

                      {/* order status na selection version */}
                      <td>
                        <select
                          // default value is the orderStatus in DB
                          value={product.orderStatus} 

                          // transactionID, and productID are passed to the updateOrder when value changes
                          onChange={(e) =>
                            updateOrderStatus(order.transactionID, product.productID, parseInt(e.target.value))
                          }
                        >
                          <option value={0}>Pending</option>
                          <option value={1}>Completed</option>
                          <option value={2}>Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>


          </>
        ) : (
          <>

            {/* admin not logged in */}
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
