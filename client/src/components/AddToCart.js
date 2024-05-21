import axios from 'axios';
import { OrderProduct } from '../backend/models/orderTransaction'



export function addToCart(product, shoppingCart, setShoppingCart, user, setUser) {
    let found = false;
    setShoppingCart((prevCart) => {
        for(let i in prevCart){
            if(product.productID == prevCart[i].productID){
                prevCart[i].orderQuantity = prevCart[i].orderQuantity + 1
                found = true;
                break
            }
        };

        let currentCart = [];
        if(found){
            currentCart = [...prevCart];
        }
        else{
            const newProductOrder = new OrderProduct({productID: product.productID, orderStatus: 0, orderQuantity: 1});
            currentCart = [...prevCart, newProductOrder];
        }

        setUser((prevUser) => {
            let updatedUser = { ...prevUser, shoppingCart: currentCart };
            return updatedUser;
        });

        let userId = user._id;
        // console.log(currentCart);

        axios.post('http://localhost:3001/shop', { userId: userId, shoppingCart: currentCart })
            .catch((error) => {
                console.log(error);
            });

        return currentCart;
    });
}
