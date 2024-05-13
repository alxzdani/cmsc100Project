import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { User } from '../backend/models/usersSchema'

function ShopPage() {
    const isUserLogIn = localStorage.getItem('token')
    const navigate = useNavigate()
    const[shoppingCart, setShoppingCart] = useState([])
    const[user, setUser] = useState()
    
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    
    const [products, setProducts] = useState([]);
    
    // Connect to API
    const fetchProducts = () => {
        axios.get('http://localhost:3001/shop')
            .then((res) => {
                setProducts(res.data.products);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }

    const fetchUser = () => {
        axios.get('http://localhost:3001/shop')
        .then((res) => {
            let users = res.data.users;
            console.log(users)
            let userIndex;
            for(let i = 0; i<users.length; i++){
                if(users[i]._id === jwtDecode(isUserLogIn).userId){
                    setUser(users[i])
                    setShoppingCart(users[i].shoppingCart)
                    userIndex = i
                    break
                }
            }
            setUser(users[userIndex])
            setShoppingCart(users[userIndex].shoppingCart)
        })
        .catch((error) => {
            console.error('Error fetching user:', error);
        });


    }

    function addToCart(product){
        setShoppingCart((shoppingCart) => {
            let currentCart = [...shoppingCart, product]
            setUser((user) => {
                user.shoppingCart = currentCart
                return user
            })

            let userId = user._id
            console.log(currentCart)
            axios.post('http://localhost:3001/shop', {userId: userId, shoppingCart: currentCart})
            .catch((error) => {
                console.log(error)
            })
            return currentCart
        })
    }

    useEffect(() => {
        fetchUser();
    }, [])
    

    useEffect(() => {
        fetchProducts();
    }, [])


    return (
        <div>
          {/* a header, when click it will direct to the shopping page */}
            <Link to='/shop'> Shopping Page </Link>  
            <div>
                {isUserLogIn ? (
                    // if the user is signed in we want to render out signout button
                    // and the list of products
                    <>
                        

                        <li><button onClick={handleLogout}> Log Out</button></li>

                        <div>
                            {products.map((product) => {
                                return (
                                    <div key={product._id}>
                                        <img src={product.productImage} alt={product.productName}/>
                                        <p>{product.productName}</p>
                                        <p>{product.productType}</p>
                                        <p>{product.productDesc}</p>
                                        <p>{product.productPrice}</p>
                                        <p>{product.productQuantity}</p>
                                        <button id="addtocart"> Add to Cart </button>
                                        <button id="addtocart" onClick={()=> {addToCart(product)}}> Add to Cart </button>
                                        {/* inserting image from the db */}
                                        {/* <img src={`data:image/jpeg;base64,${product.productImage.data.toString('base64')}`} alt={product.productName}/> */}
                                    </div>
                                )
                            })}
                        </div>
                        
                    </>
                ) : (
                        // if they are not logged in
                        <>
                            <Link to='/login'><li>Log in</li></Link>
                            <Link to='/signup'><li>Sign up</li></Link>
                        </>
                    )}
            </div>
        </div>
    )
}

export default ShopPage
