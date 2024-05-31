import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar"
import Forbidden from "../components/Forbidden"

export default function ManageOrdersPage() {
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);


  const isUserLogIn = localStorage.getItem('token');

  // Fetch data for user, transactions, and products from the database
  const getData = () => {
    if (isUserLogIn) { // check first if user is logged in or not before fetching data
      axios.get('http://localhost:3001/manage-orders', { params: { token: isUserLogIn } })
        .then((res) => {
          setUser(res.data.user);
          setTransactions(res.data.transactions);
          setProducts(res.data.products);
        })
        .catch((error) => {
          console.error(error.response.data);
        });
    }
  };

  // Function to fetch and sort all orders
  function fetchAllOrders() {
    let pendings = [];
    let completed = [];
    let canceled = [];

    // for every transaction in the database, sort each product by orderStatus
    for (let i = 0; i < transactions.length; i++) {
      for (let j = 0; j < transactions[i].products.length; j++) {
        if (transactions[i].products[j].orderStatus === 0) {
          pendings.push([transactions[i].products[j], transactions[i].transactionID, transactions[i].modeOfTransaction]);
        } else if (transactions[i].products[j].orderStatus === 1) {
          completed.push([transactions[i].products[j], transactions[i].transactionID, transactions[i].modeOfTransaction]);
        } else if (transactions[i].products[j].orderStatus === 2) {
          canceled.push([transactions[i].products[j], transactions[i].transactionID, transactions[i].modeOfTransaction]);
        }
      }
    }

    return { pendings, completed, canceled };
  }

  // Function to cancel an order
  function cancelOrder(transaction) {
    axios.post('http://localhost:3001/manage-orders/cancel', { orderProduct: transaction[0], transactionID: transaction[1] })
      .catch((error) => {
        console.log(error);
      });
  }

  // Dynamically update user view every cancel action
  useEffect(() => {
    getData();
  }, [user, transactions, products]);

  // Render a table for each status
  const renderTable = (transactions, statusLabel) => (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{statusLabel} Orders</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Product ID
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Product Price
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Mode of Transaction
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Order Quantity
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Order Status
              </th>
              {statusLabel === 'Pending' && (
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              let productIndex = products.findIndex(p => p.productID === transaction[0].productID);
              return (
                <tr key={`${transaction[1]}-${transaction[0].productID}`}>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction[1]}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {products[productIndex].productName}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction[0].productID}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    Php. {products[productIndex].productPrice}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction[2]}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction[0].orderQuantity}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                    {transaction[0].orderStatus === 0 ? 'Pending' :
                      transaction[0].orderStatus === 1 ? 'Completed' : 'Canceled'}
                  </td>
                  {transaction[0].orderStatus === 0 && (
                    <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                      <button onClick={() => cancelOrder(transaction)}
                        className="text-red-500 hover:text-red-700 font-semibold">
                        Cancel
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Ensure user is loaded before rendering
  if (user != null) {
    const { pendings, completed, canceled } = fetchAllOrders();

    return (
      <div className="flex flex-col min-h-screen bg-[#eaf8e9]">
        
          {isUserLogIn ? (
            <>
              <Navbar />
              <div className="flex-grow px-20 pt-10"></div>
              <h1 className="pt-16 text-3xl font-bold text-left mb-6">Manage Orders</h1>
              {renderTable(pendings, 'Pending')}
              {renderTable(completed, 'Completed')}
              {renderTable(canceled, 'Cancelled')}
            </>
          ) : (
            <>
            <Forbidden />
            </>
          )}
        </div>
     
    );
  }



  return null;
}