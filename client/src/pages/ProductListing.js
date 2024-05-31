import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Forbidden from "../components/Forbidden"
import AdminNavbar from '../components/AdminNavbar'
import Dropdown from "../components/Dropdown"
import ProductCard from "../components/ProductCard"

function ProductListing() {
    const isAdminLogIn = localStorage.getItem('userType') === 'admin';
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [navbarOpen, setNavbarOpen] = useState(false);

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
    
    useEffect(() => {   // fetch sorted prodcuts
        fetchProducts(sortConfig.key, sortConfig.direction);
    }, [sortConfig.key, sortConfig.direction]);

    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
      };
    
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
            {isAdminLogIn ? (
                <>
                    <div className="flex flex-row">
                        <div className={`${navbarOpen  ? 'w-1/4' : 'w-20'} transition-all duration-500 overflow-hidden`}>
                        <AdminNavbar navbarOpen={navbarOpen} toggleNavbar={toggleNavbar} isDashboard={false}/>
                        </div>
                        <div className={`${navbarOpen  ? 'w-3/4' : 'w-11/12'} h-screen transition-all duration-500 p-12 text-left`}>
                        <div className={`w-full mx-auto`}>
                            <div className="flex flex-row border-b-2 font-semibold border-green pb-5 text-left">
                                <h1 className="text-3xl text-green">Products Listing</h1>
                                <div className="w-20"></div>
                                <Dropdown 
                                    onSortByName={() => sortProducts('productName')} 
                                    onSortByType={() => sortProducts('productType')} 
                                    onSortByPrice={() => sortProducts('productPrice')} 
                                    onSortByQuantity={() => sortProducts('productQuantity')} 
                                />
                                <p className="ml-10 inline-flex w-fit justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">{sortConfig.direction ? sortConfig.direction.charAt(0).toUpperCase() + sortConfig.direction.slice(1) : 'Sort Order'}</p>
                            </div>
                           
                        </div>
                        <div className="mt-5 ">
                    <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2 pb-20">
                        {products.map((product) => {
                            return (
                                <ProductCard 
                                key={product._id} 
                                product={product} 
                                isAdmin={true}
                                />
                            )
                        })}
                    </div>
                        </div>
                        </div>
                    </div>
                </>
            ) : (
                // if they are not logged in
                <>
                <Forbidden />
                </>
            )}
        </div>
    );
}

export default ProductListing;
