import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'

function ShopPage() {
    const isUserLogIn = !!localStorage.getItem('token')
    const navigate = useNavigate()
    
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    
    const [products, setProducts] = useState([]);

    // Connect to API
    const fetchProducts = () => {
        axios
            .get('http://localhost:3001/shop')
            .then((res) => {
                setProducts(res.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }

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
                                        <p>{product.productImage}</p>
                                        <p>{product.productName}</p>
                                        <p>{product.productType}</p>
                                        <p>{product.productDesc}</p>
                                        <p>{product.productPrice}</p>
                                        <p>{product.productQuantity}</p>

                                        {/* inserting image from the db */}
                                        <img src={`http://localhost:3001/images/${product.image}`} alt={product.productName}/>
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
