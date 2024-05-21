import axios from 'axios';

export function addToCart(product, shoppingCart, setShoppingCart, user, setUser) {
    setShoppingCart((prevCart) => {
        let currentCart = [...prevCart, product];
        setUser((prevUser) => {
            let updatedUser = { ...prevUser, shoppingCart: currentCart };
            return updatedUser;
        });

        let userId = user._id;
        console.log(currentCart);

        axios.post('http://localhost:3001/shop', { userId: userId, shoppingCart: currentCart })
            .catch((error) => {
                console.log(error);
            });

        return currentCart;
    });
}
