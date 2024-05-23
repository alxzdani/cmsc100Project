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
    const [disabled, setDisabled] = useState(false)
    let price = 0;
    const navigate = useNavigate()

    const isUserLogIn = localStorage.getItem('token')


    const getData = () => { //gets user, cart, and products data from database
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

    function getTotalPrice(){ //sums up total price of products in the cart
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

    function checkoutOrder(){ //called when checkout button is clicked
        const now = new Date() //gets date in Date data type
        const currentTimeInString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`; //gets time in string

        //create orderTransaction object
        axios.post('http://localhost:3001/cart', 
        {
            method: 1,
            product: null, //since we are checking out, the data used for removing items in cart are set to null
            transactionID: uuidv4(), 
            products: cart, 
            userID: jwtDecode(isUserLogIn).userId, 
            email: user.email, 
            address:  document.getElementById("address-text-area").value, 
            dateOrdered: now, 
            time:currentTimeInString
        })
        .then(()=>{
            document.getElementById("address-text-area").value = "";
            navigate('/shop');
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function removeItem(product){
        axios.post('http://localhost:3001/cart', //calls the same post method
        {
            method: 0, //method set to 0 for removing items in cart
            product:product,
            transactionID: null, 
            products: null, 
            userID: jwtDecode(isUserLogIn).userId, 
            email: null, 
            address:  null, 
            dateOrdered: null, 
            time:null
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getData();
    }, [user, cart, products])

    useEffect(()=>{ //disables and enables the checkout button if cart is empty or not
        if(cart.length === 0){
            setDisabled(true)
        }
        else{
            setDisabled(false)
        }
    }, [disabled, cart])

    price = getTotalPrice(); //gets total price 

    //since setStates does not immediately trigger, display will only render if user data has been set
    if(user != null){ 
        return(
            <div>
            { isUserLogIn ? ( //check if user is logged in based on token
                <>
                {/* displays user name, email, cart contents */}
                 <p>Name: {user.fname + user.mname + user.lname}</p>
                 <p>Email: {user.email}</p>
                 <p>Shopping Cart</p>
                 <div>
                     {cart.map((cartItem) => {
                         let productIndex = 0;
                         //cross references information of cartItems which are orderProduct objects to product objects in Products database
                         for(let i=0; i<products.length; i++){ 
                             if(cartItem.productID === products[i].productID){
                                 productIndex = i;
                                 break
                             }
                         }
                         return ( //display information about product
                             <div key={cartItem._id}>
                                 <p>{products[productIndex].productName}</p>
                                 <p>{cartItem.productID}</p>
                                 <p>{products[productIndex].productPrice}</p>
                                 <p>{cartItem.orderQuantity}</p>
                                 <button id="cancel-button" onClick={() => removeItem(cartItem)}>Remove</button>
                             </div>
                         )
                     })}
                 </div>
                 {/* text area where user will input their address */}
                 <p >Address</p>
                 <textarea id="address-text-area" style={{borderwidth: 2}}></textarea>
                 {/* total price rounded off to two decimal to places */}
                 <p>Total Price: P{price.toFixed(2)}</p> 
                 <button disabled={disabled} id="checkout-button" type='submit' onClick={()=>checkoutOrder()} >Checkout</button>
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