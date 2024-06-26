import React, { useState } from 'react';
import { useSnackbar } from '../components/SnackbarContext';
import { CircleX, CircleCheckBig } from 'lucide-react'

export default function ProductCard({ product, onAddToCart, isAdmin, shoppingCart, inventory }) {
    const [isInCart, setIsInCart] = useState(true);
    const [counter, setCounter] = useState(1)
    const [isHovering, setIsHovering] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const { showSnackbar } = useSnackbar();


    const handleAddToCart = () => {
        let found = false
        for(let i=0; i<shoppingCart.length; i++){
            if(shoppingCart[i].productID == product.productID){
                if(product.productQuantity >= shoppingCart[i].orderQuantity+counter){
                    console.log("NOT YET EXCEEDING")
                    for(let i = 0; i<counter; i++){
                        onAddToCart(product)
                    }
                    showSnackbar(<CircleCheckBig />, "Added to Cart!", `${counter} ${product.productName} sucessfully added to cart!`, "teal");
                    break
                }
                else if(product.productQuantity < shoppingCart[i].orderQuantity+counter){
                    showSnackbar(<CircleX />, "Order Quantity Exceeded!", `You have exceeded the maximum order quantity for ${product.productName}.`, "teal");
                }

                found = true
                
            }
        }
        if(found == false){
            for(let i = 0; i<counter; i++){
                onAddToCart(product)
            }
            showSnackbar(<CircleCheckBig />, "Added to Cart!", `${counter} ${product.productName} sucessfully added to cart!`, "teal");
        }    
       setCounter(1)

    };

    const handleRemoveFromCart = () => {
        if (cartQuantity > 1) {
            setCartQuantity(cartQuantity - 1);
        } else if (cartQuantity === 1) {
            setCartQuantity(cartQuantity - 1);
        }
    };

    const decreaseCount = () => {
        setCounter(counter - 1)
    }

    const increaseCount = () => {
        let found = false
        console.log(shoppingCart)
        console.log(product)
        for(let i=0; i<shoppingCart.length; i++){
            if(shoppingCart[i].productID == product.productID){
                if(product.productQuantity > shoppingCart[i].orderQuantity+counter){
                    console.log("NOT YET EXCEEDING")
                    setCounter(counter + 1)
                    break
                }
                else if(product.productQuantity <= shoppingCart[i].orderQuantity+counter){
                    showSnackbar(<CircleX />, "Order Quantity Exceeded!", `You have exceeded the maximum order quantity for ${product.productName}.`, "teal");
                }
                
                
                found = true
            }
        }
        if(found == false){
            setCounter(counter + 1)
        }
    }
    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };


    return (
        <div className="w-80 border-2 bg-white border-notgreen shadow-md rounded-xl p-10 place-items-start text-left">
            <img src={product.productImage} alt={product.productName} className="mx-auto mb-5 object-contain" style={{ height: "160px" }} />
            <div className="flex flex-row">
                <div className="flex flex-col">
                    <h1 className="font-bold text-lg">{product.productName}</h1>
                    <p className="text-grey text-sm">
                        {product.productType === 1 ? 'Crop' : 'Poultry'}
                    </p>
                    <p className="text-notblack text-sm">
                        {product.productQuantity === 0 ? 'Out of stock' : 'Stocks Left: ' + `${product.productQuantity}`}
                    </p>
                </div>
                <span className="m-auto"></span>
                <div className="flex flex-row space-x-10">
                    <button type="button" className="px-2 text-lightgrey rounded-md hover:bg-gray-50" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} id="menu-button" aria-expanded="true" aria-haspopup="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg></button>
                    {isHovering && (
                    <div className="absolute mt-2 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4 rounded-md w-auto max-w-full">
                        <p className="whitespace-pre-wrap">{product.productDesc}</p>
                    </div>
                    )}
                </div>
            </div>

            <div className="flex flex-row mx-auto mb-5">
                <div className="m-auto"></div>
                <p className="text-right font-bold text-notgreen">Php {product.productPrice}.00</p>
            </div>
            {isAdmin === false ? [<>{product.productQuantity <= 0 ? [
                <><button
                className="bg-lightgrey text-white rounded-lg px-16 py-2 text-lg self-center"
                disabled
                >Add to Cart</button>
                </>
            ] : [
                <>
                <button
                className="bg-notgreen text-white rounded-lg px-16 py-2 text-lg self-center"
                onClick={handleAddToCart}
                >Add to Cart</button>
                <div className="flex flex-row space-x-5 my-5 items-center justify-center">
                <p>Quantity: </p>
                {counter > 1 && <button className="bg-red-500 text-white rounded-full px-2 text-lg" onClick={decreaseCount}>-</button>}
                {counter <= 1 && <button className="bg-lightgrey text-white rounded-full px-2 text-lg" onClick={decreaseCount} disabled>-</button>}
                <p className="">{counter}</p>
                {counter < product.productQuantity && <button className="bg-notgreen text-white rounded-full px-2 text-lg" onClick={increaseCount}>+</button>}
                {counter >= product.productQuantity && <button className="bg-green text-gray rounded-full px-2 text-lg" onClick={increaseCount} disabled>+</button>}
                </div>
                </>
            ]}</>] : <></>}
            
        </div>
    )
}
