import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SalesReport() {
  const isAdminLoggedIn = localStorage.getItem('userType') === 'admin';
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState({ weekly: {}, monthly: {}, annually: {} });
  const [period, setPeriod] = useState('weekly'); // default to weekly
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
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
    <div>
      <h1>Order Fulfillment</h1>
      <div>
        {isAdminLoggedIn ? (
          <>
            <button onClick={handleLogout}>Log Out</button>
            

            {/* button for choosing which period of sales report to view */}
            <div>
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

export default SalesReport;
