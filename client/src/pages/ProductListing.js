import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Forbidden from "../components/Forbidden"

function ProductListing() {
    const isAdminLogIn = localStorage.getItem('userType') === 'admin';
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const [products, setProducts] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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
        <div>
            Product Listing
            <div>
                {isAdminLogIn ? (
                    // if the admin is signed in we want to render out signout button
                    // and the list of products
                    <>
                        <li><button onClick={handleLogout}> Log Out</button></li>
                        <div>
                            {/* Sorting buttons or dropdown menus */}
                            <button onClick={() => sortProducts('productName')}>Sort by Name</button>
                            <br/>
                            <button onClick={() => sortProducts('productType')}>Sort by Type</button>
                            <br/>
                            <button onClick={() => sortProducts('productPrice')}>Sort by Price</button>
                            <br/>
                            <button onClick={() => sortProducts('productQuantity')}>Sort by Quantity</button>
                            <br/>

                            {products.map((product) => {
                                return (
                                    <div key={product._id}>
                                        <img src={product.productImage} alt={product.productName}/>
                                        <p>{product.productName}</p>
                                        <p>{product.productType}</p>
                                        <p>{product.productPrice}</p>
                                        <p>{product.productDesc}</p>
                                        <p>{product.productQuantity}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                ) : (
                    // if they are not logged in
                    <>
                    <Forbidden />
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductListing;
