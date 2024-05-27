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
    const fetchProducts = () => {
        axios.get('http://localhost:3001/shop')
            .then((res) => {
                setProducts(res.data.products);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const sortProducts = (key) => { // key determines the product to be sorted
        let direction = 'ascending';
        
        // if it is true that the sorting condition is currently ascending, toggle it to become descending
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'; 
        }

        const sortedProducts = [...products].sort((a, b) => {

            //if it is currently ascending, make it descending
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            
            //if it is currently descending, make it ascending
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });

        setProducts(sortedProducts); // render sorted products

        setSortConfig({ key, direction });  // accepting the product and the direction
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
