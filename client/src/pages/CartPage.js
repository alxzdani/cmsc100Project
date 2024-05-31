import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { OrderTransaction } from '../backend/models/orderTransaction';
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
import Navbar from "../components/Navbar"
import Forbidden from "../components/Forbidden"
import { useSnackbar } from '../components/SnackbarContext';
import { CircleX, CircleCheckBig } from 'lucide-react'

export default function CartPage() {
    const [user, setUser] = useState()
    const [cart, setCart] = useState([])
    const [products, setProducts] = useState([])
    const [disabled, setDisabled] = useState(false)
    const [popup, setPopup] = useState(false)
    const [delItem, setDelItem] = useState()
    const [delProd, setDelProd] = useState()
    const [coConfirm, setCoConfirm] = useState(false)

    let price = 0;
    const navigate = useNavigate()
    const { showSnackbar } = useSnackbar();

    const isUserLogIn = localStorage.getItem('token')

    const togglePopup = () => {
        setPopup(!popup)
    }

    const toggleCheckout = () => {
        setCoConfirm(!coConfirm)
    }
    // useEffect(() => { // if user not log in redirect them to sign up page
    //     if (!isUserLogIn) {
    //         return(
    //             <>
    //             <Forbidden />
    //             </>
    //         )
    //     } else {
    //         getData();
    //     }
    // }, [isUserLogIn, navigate]);


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
        if((document.getElementById("address-text-area").value).replace(/\s/g,'') === ""){
            showSnackbar(<CircleX />, "Invalid Input!", `Address field is required!.`, "teal");
        }
        else{
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
                    showSnackbar(<CircleCheckBig />, "Successfully Checked Out!", `The products in your cart has been successfully checked out.`, "teal");
                    navigate('/shop');
                })
                .catch((error) => {
                    showSnackbar(<CircleX />, "Error!", `Error has been encountered while trying to check out items!.`, "teal");
                    console.log(error);
                });
        }
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
        .then(()=>{
            showSnackbar(<CircleCheckBig />, "Item Removed!", `${delProd.productName} has been removed from your cart.`, "teal");
        })
        .catch((error) => {
            showSnackbar(<CircleX />, "Error!", `An error was encountered while trying to access your shopping cart.`, "teal");
            console.log(error);
        });
        togglePopup();
    }

    function decreaseItem(product) {
        axios.post('http://localhost:3001/cart', //calls the same post method
            {
                method: 3, //method set to 3 for decreasing items in cart
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

    function increaseItem(product) {
        axios.post('http://localhost:3001/cart', //calls the same post method
            {
                method: 4, //method set to 4 for increasing items in cart
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
            <div><Navbar />
                <div className="mt-20 px-20 bg-[#eaf8e9] min-h-screen pb-20">

                    {isUserLogIn ? (
                        <>
                            <div className="container mx-auto p-4">
                                <h1 className="text-3xl font-bold mt-3 mb-4 text-left">{user.fname} {user.mname} {user.lname}'s Cart</h1>

                                
                                {cart.length != 0 ? [<>
                                {cart.map((cartItem, index) => {
                                    <div className="grid grid-cols-5 gap-4 mb-4 font-bold">
                                    <div className="col-span-2 text-lg">Product</div>
                                    <div className="text-lg">Quantity</div>
                                    <div className="text-lg">Price</div>
                                    <div className="text-lg">Total Price</div>
                                    </div>
                                    const product = products.find(p => p.productID === cartItem.productID) || {};
                                    const totalPrice = (product.productPrice * cartItem.orderQuantity).toFixed(2);
                                    return (
                                        <div key={cartItem._id} className="grid grid-cols-5 gap-4 items-center bg-white p-4 shadow rounded-lg mb-4">
                                            <div className="col-span-2 flex items-center">
                                                <img src={product.productImage} alt="Product" className="w-32 h-32 object-contain rounded mr-4" />
                                                <div className="text-left">
                                                    <p className="text-xl font-bold">{product.productName}</p>
                                                    <p className="text-sm text-gray-500">{product.productType === 1 ? 'Crop' : 'Poultry'}</p>
                                                    <p className="text-sm">{product.productDesc}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                {cartItem.orderQuantity>1 && <button className="p-2" onClick={()=>decreaseItem(cartItem)}> {/*needs functionality for decreasing item number*/}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-minus">
                                                        <path d="M5 12h14" />
                                                    </svg>
                                                </button>}
                                                <p className="text-md mx-2">{cartItem.orderQuantity}</p>
                                                <button className="p-2" onClick={()=>increaseItem(cartItem)}> {/*needs functionality for increasing item number*/}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus">
                                                        <path d="M12 5v14" />
                                                        <path d="M5 12h14" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-md">Php {product.productPrice.toFixed(2)}</p>
                                            <div className="flex items-center justify-center">
                                                <p className="text-md mr-4">Php {totalPrice}</p>
                                                <button onClick={()=>{ setDelItem(cartItem);
                                                                        setDelProd(product)
                                                                        togglePopup()}} className="p-2 text-greyer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x">
                                                        <path d="M18 6 6 18" />
                                                        <path d="m6 6 12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            
                                            {popup && 
                                                (
                                                    <div className="modal" style= {{width: '100vw', height: '100vh', top: 0, left: 0, right: 0, bottom: 0, position: 'fixed'}}>
                                                        <div className='overlay' style={{background: "rgba(49,49,49,0.8)", height: "100%", width: "100%", overflowy: "auto"}}></div>
                                                        <div className='modal-content rounded-lg p-20' style={{position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", lineheight: 1.4, background: "#f1f1f1", padding: "14px 28px", borderradius: 3, maxwidth: 600, minwidth: 300}}>
                                                            <p className="mb-6">Are you sure you want to remove {delProd.productName} from your cart?</p>
                                                            <div className="space-x-5">
                                                                <button className="bg-notgreen text-white rounded-lg px-16 py-2 text-lg self-center" onClick={() => removeItem(delItem)}>Yes</button>
                                                                <button className="bg-notgreen text-white rounded-lg px-16 py-2 text-lg self-center" onClick={()=> togglePopup()}>No</button>
                                                        
                                                            </div>
                                                            </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    );
                                })}
                                <div className="mt-4">
                                    <label htmlFor="address-text-area" className="block text-gray-700 text-sm font-bold mb-2" required>Address</label>
                                    <textarea id="address-text-area" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" style={{ borderWidth: 2 }}></textarea>
                                    <p className="mt-4"> Mode of Payment: <b>Cash On Delivery</b></p>
                                    <div className="flex flex-row mt-4 space-x-2 border-2 p-2 w-fit rounded-lg mx-auto">
                                        <p className="">Total: </p>
                                        <p className="font-bold text-notgreen">Php {cart.reduce((total, item) => total + (products.find(p => p.productID === item.productID)?.productPrice * item.orderQuantity), 0).toFixed(2)}</p>
                                
                                    </div>
                                    <button disabled={disabled} onClick={()=>toggleCheckout()} className="mt-4 bg-notgreen border-2 border-notgreen hover:bg-white hover:text-notgreen text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
                                        Checkout
                                    </button>
                                </div>
                                </>] : <div className="text-left">No products in cart</div>
                                
                            }

                                
                            </div>

                            {coConfirm && 
                                (
                                    <div className="modal" style= {{width: '100vw', height: '100vh', top: 0, left: 0, right: 0, bottom: 0, position: 'fixed', overflowy: "auto"}}>
                                        <div className='overlay' style={{background: "rgba(49,49,49,0.8)", height: "100%", width: "100%", overflowy: "auto"}}></div>
                                        <div className='modal-content rounded-lg' style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", lineheight: 1.4, background: "#f1f1f1", padding: "14px 28px", borderradius: 3, height: "70%",maxwidth: 600, minwidth: 300, overflowY: "scroll"}}>
                                        <h1 className="text-3xl font-bold mt-3 mb-4 text-left">Order Summary</h1>
                                            <div className="grid grid-cols-4 gap-3 mb-4 font-bold">
                                                <div className="col-span-2 text-lg">Product</div>
                                                <div className="text-lg"> Quantity</div>
                                                <div className="text-lg"> Price</div>
                                            </div>

                                            {cart.map((cartItem, index) => {
                                                const product = products.find(p => p.productID === cartItem.productID) || {};
                                                const totalPrice = (product.productPrice * cartItem.orderQuantity).toFixed(2);
                                                return (
                                                    <div key={cartItem._id} className="grid grid-cols-4 gap-3 items-center bg-white p-4 shadow rounded-lg mb-4">
                                                        <div className="col-span-2 flex items-center">
                                                            <img src={product.productImage} alt="Product" className="w-32 h-32 object-contain rounded mr-4" />
                                                            <div className="text-left">
                                                                <p className="text-xl font-bold">{product.productName}</p>
                                                                <p className="text-sm text-gray-500">{product.productType === 1 ? 'Crop' : 'Poultry'}</p>
                                                                <p className="text-sm">{product.productDesc}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-center">
                                                            <p className="text-md mx-2">{cartItem.orderQuantity}</p>
                                                        </div>
                                                        <p className="text-md">Php {product.productPrice.toFixed(2)}</p>
                                                    </div>
                                            )})}
                                            <div className="flex flex-col space-y-5">
                                                <p className="mt-4"><b>Total Price:</b>  Php {cart.reduce((total, item) => total + (products.find(p => p.productID === item.productID)?.productPrice * item.orderQuantity), 0).toFixed(2)}</p>
                                                <p className="mt-4"><b>Mode of Payment:</b> Cash On Delivery</p>
                                                <p className="mb-12"><b>Delivery Address:</b> {document.getElementById("address-text-area").value}</p>
                                                <div className="space-x-5 my-4">
                                                   <button className="bg-red-500 border-2 border-red-500 hover:bg-white hover:text-red-500 text-white rounded-lg px-16 py-2 text-lg self-center" onClick={()=> toggleCheckout()}>Cancel</button>
                                                   <button className="bg-notgreen border-2 border-notgreen hover:bg-white hover:text-notgreen text-white rounded-lg px-16 py-2 text-lg self-center" onClick={() => checkoutOrder()}>Place Order</button>
                                                    
                                                </div>
                                                
                                            </div>
                                            </div>
                                    </div>
                                )
                            }
                            


                            
                        </>
                    ) : (
                        <>
                        <Forbidden />
                        </>
                    )}
                </div>
            </div>
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