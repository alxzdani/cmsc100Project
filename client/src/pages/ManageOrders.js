import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar"
import Forbidden from "../components/Forbidden"
import { useSnackbar } from '../components/SnackbarContext';
import { CircleX, CircleCheckBig } from 'lucide-react'

export default function ManageOrdersPage() {
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const isUserLogIn = localStorage.getItem('token');
  const [popup, setPopup] = useState(false)
  const [delItem, setDelItem] = useState()
  const [delProd, setDelProd] = useState()
  const { showSnackbar } = useSnackbar();

  const togglePopup = () => {
    setPopup(!popup)
  }


  // Fetch data for user, transactions, and products from the database
  const getData = () => {
    if(isUserLogIn)
    { axios.get('http://localhost:3001/manage-orders', { params: { token: isUserLogIn } })
      .then((res) => {
        setUser(res.data.user);
        setTransactions(res.data.transactions);
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
      return
    }
    return
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
    console.log(transaction)
    axios.post('http://localhost:3001/manage-orders/cancel', { orderProduct: transaction[0], transactionID: transaction[1] })
    .then(()=> {
      showSnackbar(<CircleCheckBig />, "Order Canceled!", `Your ${delProd.productName} order has been canceled successfully.`, "teal");
    })
    .catch((error) => {
      console.log(error);
    });
    togglePopup()
  }

  // Dynamically update user view every cancel action
  useEffect(() => {
    getData();
  }, [user, transactions, products]);

  // useEffect(() => { // if user not log in redirect them to login page
  //   if (!isUserLogIn) {
  //       return(
  //         <>
  //         <Forbidden />
  //         </>
  //       )
  //     }
  // }, [isUserLogIn]);

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
                      <button onClick={() => {togglePopup();
                                              setDelItem(transaction);
                                              setDelProd(products[productIndex]);
                      }}
                        className="text-red-500 hover:text-red-700 font-semibold">
                        Cancel
                      </button>
                    </td>
                  )}

                  {popup && 
                    (
                      <div className="modal" style= {{width: '100vw', height: '100vh', top: 0, left: 0, right: 0, bottom: 0, position: 'fixed'}}>
                          <div className='overlay' style={{background: "rgba(49,49,49,0.8)", height: "100%", width: "100%"}}></div>
                          <div className='modal-content' style={{position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", lineheight: 1.4, background: "#f1f1f1", padding: "14px 28px", borderradius: 3, maxwidth: 600, minwidth: 300}}>
                              <p>Are you sure you want to cancel your order of {delProd.productName}?</p>
                              <button className="bg-green text-white rounded-lg px-16 py-2 text-lg self-center" onClick={() => cancelOrder(delItem)}>Confirm</button>
                              <button className="bg-green text-white rounded-lg px-16 py-2 text-lg self-center" onClick={()=> togglePopup()}>Cancel</button>
                          </div>
                      </div>
                    )
                  }
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
      <>
       <div className="flex flex-col min-h-screen bg-[#eaf8e9]">
        <Navbar /><div className="flex-grow px-20 pt-10">
          {isUserLogIn ? (
            <>
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
      </div>
      
      

      
      </>
     
    );
  }
  else{
    return(
      <>
      <Forbidden />
      </>
    )
  }



}
