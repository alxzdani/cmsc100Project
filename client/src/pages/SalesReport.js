import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Forbidden from "../components/Forbidden";
import AdminNavbar from '../components/AdminNavbar';

function SalesReport() {
  const isAdminLoggedIn = localStorage.getItem('userType') === 'admin';
  const [salesData, setSalesData] = useState({ weekly: {}, monthly: {}, annual: {} });
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
            <AdminNavbar navbarOpen={navbarOpen} toggleNavbar={toggleNavbar} isDashboard={false} />
          </div>
          <div className={`${navbarOpen ? 'w-3/4' : 'w-[99%]'} h-screen transition-all duration-500 pl-12 pr-12 pt-12 text-left overflow-y-auto rounded-lg`}>
            <div className="w-full mx-auto">
              <h1 className="text-3xl text-notgreen border-b-2 font-semibold border-notgreen pb-5 text-left">Sales Report</h1>
            </div>
            <div className="my-5">
              <div className="flex space-x-2 mb-4">
                <button className={`px-4 py-2 rounded ${period === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setPeriod('weekly')}>Weekly</button>
                <button className={`px-4 py-2 rounded ${period === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setPeriod('monthly')}>Monthly</button>
                <button className={`px-4 py-2 rounded ${period === 'annually' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setPeriod('annually')}>Annual</button>
              </div>

              <h2 className="text-2xl font-semibold">{period.charAt(0).toUpperCase() + period.slice(1)} Sales</h2>

              <p className="font-semibold">Total Sales: Php {(salesData[period]?.totalSales || 0).toFixed(2)}</p>

              <div className="overflow-x-auto mt-4 border-2 rounded-lg">
                <table className="min-w-full leading-normal shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                      <th className="px-5 py-3">Product ID</th>
                      <th className="px-5 py-3">Product Name</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3">Quantity Sold</th>
                      <th className="px-5 py-3">Total Income</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {salesData[period]?.products?.map(product => (
                      <tr key={product.productID} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-5 py-4">{product.productID}</td>
                        <td className="px-5 py-4">{product.productName}</td>
                        <td className="px-5 py-4">{product.productPrice}</td>
                        <td className="px-5 py-4">{product.totalQuantitySold}</td>
                        <td className="px-5 py-4">{product.totalIncome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
