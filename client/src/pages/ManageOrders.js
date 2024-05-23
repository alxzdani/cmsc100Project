import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function ManageOrdersPage(){
    const [user, setUser] = useState([])
    const [products, setProducts] = useState([])
    const [transactions, setTransactions] = useState([])
    let sortedTransactions;
    const isUserLogIn = localStorage.getItem('token')
    

    const getData = () => {
        axios.get('http://localhost:3001/manage-orders', {params: {token: isUserLogIn}})
        .then((res) => {
            setUser(res.data.user)
            setTransactions(res.data.transactions)
            setProducts(res.data.products)
        })
        .catch((error) => {
            console.error(error.res.data);
        });
    }

    function fetchAllOrders(){
        let allTransactions = [];
        let pendings = []
        let completed = []
        let canceled = []
        for(let i=0; i<transactions.length;i++){
            for(let j = 0; j<transactions[i].products.length; j++){
                if(transactions[i].products[j].orderStatus === 0){
                    // console.log("PENDING FOUND")
                    //pushes an array containing a product order from a transaction and its transactionID
                    pendings.push([transactions[i].products[j], transactions[i].transactionID]); 
                }
                else if(transactions[i].products[j].orderStatus === 1){
                    // console.log("COMPLETED FOUND")
                    completed.push([transactions[i].products[j], transactions[i].transactionID]);
                }
                else if(transactions[i].products[j].orderStatus === 2){
                    // console.log("CANCELED FOUND")
                    canceled.push([transactions[i].products[j], , transactions[i].transactionID]);
                }
            }
        }

        allTransactions.concat(pendings, completed)
        allTransactions = pendings.concat(completed, canceled)
        // console.log(allTransactions) 
        return allTransactions
    }

    function cancelOrder(transaction){
        axios.post('http://localhost:3001/manage-orders', {orderProduct: transaction[0], transactionID:transaction[1]})
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getData();
    }, [user, transactions, products])
    
    // sortedTransactions = fetchAllOrders();
    // console.log(sortedTransactions)

    if(user != null){
        sortedTransactions = fetchAllOrders();
        console.log(sortedTransactions)
        return(
            <div>
            { isUserLogIn ? (
                <>
                 <p>Manage Orders</p>
                 <div>
                     {sortedTransactions.map((transaction) => {
                         let productIndex = 0;
                         for(let i=0; i<products.length; i++){
                             if(transaction[0].productID === products[i].productID){
                                 productIndex = i;
                                 break
                             }
                         }
                         return (
                            <div key={`${transaction[1]}-${transaction[0].productID}`}>
                                <p>{products[productIndex].productName}</p>
                                <p>{transaction[0].productID}</p>
                                <p>{products[productIndex].productPrice}</p>
                                <p>{transaction[0].orderQuantity}</p>
                                {(transaction[0].orderStatus === 0) && <button id='cancel-order' onClick={()=>cancelOrder(transaction)}>Cancel</button>}
                                {(transaction[0].orderStatus === 1) && <p>Completed</p>}
                                {(transaction[0].orderStatus === 2) && <p>Canceled</p>}
                            </div>
                        )
                     })}
                 </div>
                </>
            ): (
                // if they are not logged in
                // forbidden route
                <>
                    <h1 className="mt-10">Error 404</h1>
                    <p className="">Forbidden Route</p>
                </>
            )}
            </div>
        )
    }


}