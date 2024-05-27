import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Forbidden from "../components/Forbidden"

function SalesReport() {
  const isAdminLoggedIn = localStorage.getItem('userType') === 'admin';
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState({ weekly: {}, monthly: {}, annually: {} });
  const [period, setPeriod] = useState('weekly');
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
      const res = await axios.get(`http://localhost:3001/orders?period=${period}`);  // fetch orders for the selected period
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error.response || error.message || error);
    }
  };

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

            <div>
              <button onClick={() => setPeriod('weekly')}>Weekly</button>
              <button onClick={() => setPeriod('monthly')}>Monthly</button>
              <button onClick={() => setPeriod('annually')}>Annual</button>
            </div>

            <h2>{period.charAt(0).toUpperCase() + period.slice(1)} Sales</h2>
            <p>Total Sales: {salesData[period]?.totalSales}</p>
            <p>Total Quantity Sold: {salesData[period]?.totalQuantity}</p>

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
          //if they are not logged in
          <>
          <Forbidden />
          </>
        )}
      </div>
    </div>
  );
}

export default SalesReport;
