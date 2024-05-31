import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Forbidden from "../components/Forbidden";
import AdminNavbar from '../components/AdminNavbar';

function SalesReport() {
  const isAdminLoggedIn = localStorage.getItem('userType') === 'admin';
  const [salesData, setSalesData] = useState({ weekly: {}, monthly: {}, annually: {} });
  const [period, setPeriod] = useState('weekly'); // default to weekly
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  useEffect(() => {
    fetchSalesData(period);
  }, [period]);

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
        <div className="flex flex-row">
          <div className={`${navbarOpen ? 'w-1/4' : 'w-20'} transition-all duration-500 overflow-hidden`}>
            <AdminNavbar navbarOpen={navbarOpen} toggleNavbar={toggleNavbar} isDashboard={false}/>
          </div>
          <div className={`${navbarOpen ? 'w-3/4' : 'w-11/12'} h-screen transition-all duration-500 p-12 text-left`}>
            <div className="w-full mx-auto">
              <h1 className="text-3xl text-notgreen border-b-2 font-semibold border-notgreen pb-5 text-left">Sales Report</h1>
            </div>
            <div className="my-5">
              <div>
                <button onClick={() => setPeriod('weekly')}>Weekly</button>
                <button onClick={() => setPeriod('monthly')}>Monthly</button>
                <button onClick={() => setPeriod('annually')}>Annual</button>
              </div>

              <h2>{period.charAt(0).toUpperCase() + period.slice(1)} Sales</h2>

              <p>Total Sales: {(salesData[period]?.totalSales || 0).toFixed(2)}</p>

              <table>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity Sold</th>
                    <th>Total Income</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData[period]?.products?.map(product => (
                    <tr key={product.productID}>
                      <td>{product.productID}</td>
                      <td>{product.productName}</td>
                      <td>{product.productPrice}</td>
                      <td>{product.totalQuantitySold}</td>
                      <td>{product.totalIncome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <Forbidden />
      )}
    </>
  );
}

export default SalesReport;
