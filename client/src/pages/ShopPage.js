import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'


function ShopPage() {
    const isUserLogIn = !!localStorage.getItem('token')
    const navigate = useNavigate()
    var productList;
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    const[products, setProducts] = useState([]);



  //connect to api
  const fetchProducts = () => {
      axios
      .get('http://localhost:3001/shop')
      .then((res) => {
          window.productList = res.data;
      })
  }

  useEffect(() => {
    fetchProducts();
}, [])

console.log(window.productList)

  //fetchProducts();
  return (
    <div>
      Shopping Page
        <div>
            {isUserLogIn ? ( // if the user is signed in we want to render out signout button
                <>
                <div>
                  {
                    window.productList?.map((product) => {
                      return(
                        <>
                          <p>{product.productName}</p>
                          <p>{product.productType}</p>
                          <p>{product.productDesc}</p>
                          <p>{product.productQuantity}</p>
                        </>
                      )
                    })
                  }
                </div>
                <Link to='/shop'> <li>Shop</li> </Link>
                <li><button onClick={handleLogout}> Log Out</button></li>

                </>
            ): (
                //if they are not logged in
                <>
                <Link to= '/login'><li>Log in</li></Link>
                <Link to = '/signup'><li>Sign up</li></Link>
                </>
            )}
        </div>

    </div>

   
  )
         }

export default ShopPage
