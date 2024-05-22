import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { OrderTransaction } from '../backend/models/orderTransaction';
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';


export default function CartPage(){
    const [user, setUser] = useState()
    const[cart, setCart] = useState([])
    const [products, setProducts] = useState([])
    let price = 0;

    const isUserLogIn = localStorage.getItem('token')



    const getData = () => {
        axios.get('http://localhost:3001/cart', {params: {token: isUserLogIn}})
        .then((res) => {
            setUser(res.data.user)
            setCart(res.data.user.shoppingCart)
            setProducts(res.data.products)
            // console.log(user)
        })
        .catch((error) => {
            console.error(error.res.data);
        });
    }

    function getTotalPrice(){
        let productIndex = 0;
        let tot_price = 0;
        for(let i=0; i<cart.length; i++){
            for(let j=0; j<products.length; j++){
                if(cart[i].productID === products[j].productID){
                    tot_price = tot_price + (products[j].productPrice * cart[i].orderQuantity);
                    break;
                       
                }
            }
        }
        return tot_price;
    }

    function checkoutOrder(){
        const now = new Date()
        const currentDateInString = `${now.getMonth()}/${now.getDay()}/${now.getFullYear()}`;
        const currentTimeInString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`; 

        axios.post('http://localhost:3001/cart', 
        {
            transactionID: uuidv4(), 
            products: cart, 
            userID: jwtDecode(isUserLogIn).userId, 
            email: user.email, 
            address:  document.getElementById("address-text-area").value, 
            dateOrdered: now, 
            time:currentTimeInString
        })
        .catch((error) => {
            console.log(error);
        });
    }



    useEffect(() => {
        getData();
  
        // console.log(cart)
    }, [user, cart, products])

    price = getTotalPrice();

    if(user != null){
        if(cart.isEmpty){
            document.getElementById('checkout-button').disabled = true
            console.log('should be disabled')
        }
        return(
            <div>
            { isUserLogIn ? (
                <>
                 <p>Name: {user.fname + user.mname + user.lname}</p>
                 <p>Email: {user.email}</p>
                 <p>Shopping Cart</p>
                 <div>
                     {cart.map((cartItem) => {
                         let productIndex = 0;
                         for(let i=0; i<products.length; i++){
                             if(cartItem.productID === products[i].productID){
                                 productIndex = i;
                                 break
                             }
                         }
                         return (
                             <div key={cartItem._id}>
                                 <p>{products[productIndex].productName}</p>
                                 <p>{cartItem.productID}</p>
                                 <p>{products[productIndex].productPrice}</p>
                                 <p>{cartItem.orderQuantity}</p>
                             </div>
                         )
                     })}
                 </div>
                 <p >Address</p>
                 <textarea id="address-text-area" style={{borderwidth: 2}}></textarea>
                 <p>Total Price: P{price.toFixed(2)}</p>
                 <button id="checkout-button" type='submit' onClick={()=>checkoutOrder()} >Checkout</button>
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