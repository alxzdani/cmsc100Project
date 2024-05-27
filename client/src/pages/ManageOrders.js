import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageOrdersPage() {
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const isUserLogIn = localStorage.getItem('token');

  // Fetch data for user, transactions, and products from the database
  const getData = () => {
    axios.get('http://localhost:3001/manage-orders', { params: { token: isUserLogIn } })
      .then((res) => {
        setUser(res.data.user);
        setTransactions(res.data.transactions);
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
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
    <div>
      <h2>{statusLabel} Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Product Name</th>
            <th>Product ID</th>
            <th>Product Price</th>
            <th>Mode of Transaction</th>
            <th>Order Quantity</th>
            <th>Order Status</th>
            {statusLabel === 'Pending' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            let productIndex = products.findIndex(p => p.productID === transaction[0].productID);
            return (
              <tr key={`${transaction[1]}-${transaction[0].productID}`}>
                <td>{transaction[1]}</td>
                <td>{products[productIndex].productName}</td>
                <td>{transaction[0].productID}</td>
                <td>{products[productIndex].productPrice}</td>
                <td>{transaction[2]}</td>
                <td>{transaction[0].orderQuantity}</td>
                <td>
                  {transaction[0].orderStatus === 0 && 'Pending'}
                  {transaction[0].orderStatus === 1 && 'Completed'}
                  {transaction[0].orderStatus === 2 && 'Canceled'}
                </td>
                {transaction[0].orderStatus === 0 && (
                  <td>
                    <button id='cancel-order' onClick={() => cancelOrder(transaction)}>Cancel</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Ensure user is loaded before rendering
  if (user != null) {
    const { pendings, completed, canceled } = fetchAllOrders();

    return (
      <div>
        {isUserLogIn ? (
          <>
            <p>Manage Orders</p>
            {renderTable(pendings, 'Pending')}
            {renderTable(completed, 'Completed')}
            {renderTable(canceled, 'Canceled')}
          </>
        ) : (
          <div>
            <h1 className="mt-10">Error 404</h1>
            <p>Forbidden Route</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
