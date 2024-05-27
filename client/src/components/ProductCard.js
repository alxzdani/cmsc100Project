import React, { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
    //const [isInCart, setIsInCart] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);

    const handleAddToCart = () => {
        if (cartQuantity === 0) {
            onAddToCart(product);
        }
        setCartQuantity(cartQuantity + 1);
    };

    const handleRemoveFromCart = () => {
        if (cartQuantity > 1) {
            setCartQuantity(cartQuantity - 1);
        } else if (cartQuantity === 1) {
            setCartQuantity(cartQuantity - 1);
        }
    };
    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div className="w-80 border-2 bg-white border-green shadow-md rounded-xl p-10 place-items-start text-left">
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
                <div className="flex flex-row">
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
                <p className="text-right font-bold text-green">Php {product.productPrice}</p>
            </div>
            {product.productQuantity === 0 ? [
                <button
                className="bg-lightgrey text-white rounded-lg px-16 py-2 text-lg self-center"
                disabled
                >Add to Cart</button>
            ] : [
                <button
                    className="bg-green text-white rounded-lg px-16 py-2 text-lg self-center"
                    onClick={handleAddToCart}
                >Add to Cart</button>
            ]
            }
            
            
            {isInCart && (
                <div className="flex flex-row space-x-5 my-5 items-center justify-center">
                    <button className="bg-red-500 text-white rounded-full px-2 text-lg" onClick={handleRemoveFromCart}>-</button>
                    <p className="">{cartQuantity} in cart</p>
                    <button className="bg-green text-white rounded-full px-2 text-lg" onClick={handleAddToCart}>+</button>
                </div>
            )}
            {isHovering && (
                <div className="absolute mt-2 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4 rounded-md w-auto max-w-full">
                    <p className="whitespace-pre-wrap">{product.productDesc}</p>
                    <p className="">{product.productQuantity} Stocks Left</p>
                </div>
            )}
            <div className="hidden" id="product-info">
                <p className="">{product.productDesc}</p>
                <p className="">{product.productQuantity} Stocks Left</p>
            </div>

        </div>
    )
}
