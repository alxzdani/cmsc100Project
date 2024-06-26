import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { User } from '../backend/models/usersSchema'
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard"
import Dropdown from "../components/Dropdown";
import Forbidden from "../components/Forbidden";
import { addToCart } from '../components/AddToCart'

function ShopPage() {
    const isUserLogIn = localStorage.getItem('token')
    const navigate = useNavigate()
    
    const [products, setProducts] = useState([])
    const [shoppingCart, setShoppingCart] = useState([])
    const [user, setUser] = useState()
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    
    const fetchUser = () => {
        axios.get('http://localhost:3001/shop')
        .then((res) => {
            let users = res.data.users;
            // console.log(users)
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

    // Connect to API
    const fetchProducts = (sortKey, sortOrder) => {
        axios.get('http://localhost:3001/shop', {
            params: { sortKey, sortOrder }
        })
        .then((res) => {
            setProducts(res.data.products);
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
        });
    };
    

    //  function addToCart(product){
    //     setShoppingCart((shoppingCart) => {
    //         let currentCart = [...shoppingCart, product]
    //         setUser((user) => {
    //             user.shoppingCart = currentCart
    //             return user
    //         })

    //         let userId = user._id
    //         console.log(currentCart)
    //         axios.post('http://localhost:3001/shop', {userId: userId, shoppingCart: currentCart})
    //         .catch((error) => {
    //             console.log(error)
    //         })
    //         return currentCart
    //     })
    // }

    useEffect(() => {
        fetchUser();
    }, []);
    
    useEffect(() => {   // fetch sorted prodcuts
        fetchProducts(sortConfig.key, sortConfig.direction);
    }, [sortConfig.key, sortConfig.direction]);
    

   
    const sortProducts = (key) => {
        let direction = 'ascending';
        
         // if it is true that the sorting condition is currently ascending, toggle it to become descending
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
    
        fetchProducts(key, direction);
        setSortConfig({ key, direction });
    };
    
    
    return (
        <>
            {isUserLogIn ? (
            <div className="">
                <Navbar />
                <div className="mt-20 px-20 bg-lightgreen">
                    
                <div>
                        <>
                        <div className="flex flex-row py-10 items-center">
                            <h1 className="text-3xl font-bold mr-10">Products</h1>
                            <Dropdown 
                                onSortByName={() => sortProducts('productName')} 
                                onSortByType={() => sortProducts('productType')} 
                                onSortByPrice={() => sortProducts('productPrice')} 
                                onSortByQuantity={() => sortProducts('productQuantity')} 
                            />

                            <p className="ml-10 inline-flex w-fit justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">{sortConfig.direction ? sortConfig.direction.charAt(0).toUpperCase() + sortConfig.direction.slice(1) : 'Sort Order'}</p>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2 pb-20">
                            {products.map((product) => {
                                return (
                                    <ProductCard 
                                    key={product._id} 
                                    product={product} 
                                    onAddToCart={() => addToCart(product, shoppingCart, setShoppingCart, user, setUser)}
                                    isAdmin={false} 
                                    shoppingCart={shoppingCart}
                                    inventory={products}  />
                                )
                            })}
                        </div>
                        </>
                </div>
            </div>
            </div>
            ) : (
                // if they are not logged in
                // forbidden route
                <>
                    <Forbidden />
                </>
            )

            }
        </>
                
    )
}

export default ShopPage
