import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { OrderTransaction } from '../backend/models/orderTransaction';
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
import Navbar from "../components/Navbar";


export default function CartPage() {
    const [user, setUser] = useState()
    const [cart, setCart] = useState([])
    const [products, setProducts] = useState([])
    const [disabled, setDisabled] = useState(false)
    let price = 0;
    const navigate = useNavigate()

    const isUserLogIn = localStorage.getItem('token')

    useEffect(() => { // if user not log in redirect them to sign up page
        if (!isUserLogIn) {
            navigate('/signup');
        } else {
            getData();
        }
    }, [isUserLogIn, navigate]);


    const getData = () => { //gets user, cart, and products data from database
        axios.get('http://localhost:3001/cart', { params: { token: isUserLogIn } })
            .then((res) => {
                setUser(res.data.user)
                setCart(res.data.user.shoppingCart)
                setProducts(res.data.products)
                // console.log(user)
            })
            .catch((error) => {
                console.error(error.response.data);
            });
    }

    function getTotalPrice() { //sums up total price of products in the cart
        let productIndex = 0;
        let tot_price = 0;
        for (let i = 0; i < cart.length; i++) {
            for (let j = 0; j < products.length; j++) {
                if (cart[i].productID === products[j].productID) {
                    tot_price = tot_price + (products[j].productPrice * cart[i].orderQuantity);
                    break;

                }
            }
        }
        return tot_price;
    }


    //generate transaction id using uuid with only maximum of six length
    const generateTransactionID = () => {
        const fullUUID = uuidv4();
        return fullUUID.slice(0, 6);
    };


    function checkoutOrder() { //called when checkout button is clicked
        const now = new Date() //gets date in Date data type
        const currentTimeInString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`; //gets time in string

        //create orderTransaction object
        axios.post('http://localhost:3001/cart',
            {
                method: 1,
                product: null, //since we are checking out, the data used for removing items in cart are set to null
                transactionID: generateTransactionID(),
                products: cart,
                userID: jwtDecode(isUserLogIn).userId,
                email: user.email,
                address: document.getElementById("address-text-area").value,
                dateOrdered: now,
                time: currentTimeInString
            })
            .then(() => {
                document.getElementById("address-text-area").value = "";
                navigate('/shop');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function removeItem(product) {
        axios.post('http://localhost:3001/cart', //calls the same post method
            {
                method: 0, //method set to 0 for removing items in cart
                product: product,
                transactionID: null,
                products: null,
                userID: jwtDecode(isUserLogIn).userId,
                email: null,
                address: null,
                dateOrdered: null,
                time: null
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getData();
    }, [user, cart, products])

    useEffect(() => { //disables and enables the checkout button if cart is empty or not
        if (cart.length === 0) {
            setDisabled(true)
        }
        else {
            setDisabled(false)
        }
    }, [disabled, cart])

    price = getTotalPrice(); //gets total price 

    //since setStates does not immediately trigger, display will only render if user data has been set
    if (user != null) {
        return (
            <div className="mt-20 px-20 bg-[#eaf8e9] min-h-screen">
                <Navbar />
                {isUserLogIn ? (
                    <>
                        <div className="container mx-auto p-4">
                            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
                            <p><strong>Name:</strong> {user.fname} {user.mname} {user.lname}</p>
                            <p><strong>Email:</strong> {user.email}</p>

                            {cart.map((cartItem) => {
                                const product = products.find(p => p.productID === cartItem.productID) || {};
                                return (
                                    <div key={cartItem._id} className="flex items-start justify-between bg-white p-4 shadow rounded-lg mb-4">
                                        <img src={product.productImage} alt="Product" className="w-32 h-32 object-contain rounded mr-4" /> {/* Changed object-cover to object-contain */}
                                        <div className="flex flex-col flex-grow justify-between">
                                            <div className="flex items-center">
                                                <p className="text-lg font-semibold mr-2">{product.productName}</p>
                                                <p className="text-sm text-gray-500">{product.productType === 1 ? 'Crop' : 'Poultry'}</p> {/* Display product type based on condition */}
                                            </div>
                                            <p className="text-sm mt-2">{product.productDesc}</p>
                                            <div className="flex items-baseline mt-2">
                                                <p className="text-md font-semibold mr-2">Quantity: {cartItem.orderQuantity}</p>
                                                <p className="text-md font-semibold">Price: ${product.productPrice}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeItem(cartItem)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded self-start">
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                            <div className="mt-4">
                                <label htmlFor="address-text-area" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                                <textarea id="address-text-area" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" style={{ borderWidth: 2 }}></textarea>
                                <p className="mt-4">Total Price: P{getTotalPrice()}</p>
                                <button disabled={disabled} onClick={checkoutOrder} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mt-10">Error 404</h1>
                        <p className="mt-4">Forbidden Route</p>
                    </div>
                )}
            </div>
        );
    }
}