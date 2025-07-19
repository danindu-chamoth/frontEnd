import { useEffect, useState } from "react";
import { clearCard, loadCard } from "../../utils/cardFunction"; // Assuming you have a utility function to load the cart
import CartCart from "../../components/cartCart"; // Assuming you have a CartCart component to display each item in the cart
import axios from "axios";

export default function Card(){

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {

        setCart(loadCard())
        // Use POST request to send cart data to get quote
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/quote`,
            {orderedItems: loadCard()}).then((response) => {
                if(response.data != null){
                    setTotal(response.data);
                    console.log("Total price fetched successfully:", response.data);
                }
            }).catch((error) => {
                console.error("Error fetching total price:", error);
            })
        
    }, [])

    function clearCart(){
        clearCard();
        setCart([]);
    }
    return (
        <div className="flex flex-col w-full h-full bg-gray-100 p-4">
            <div className="text-2xl font-bold mb-4">Shopping Cart</div>
            
            <div className="w-full h-full flex flex-col">
                {
                    cart.map((item, index) => {
                        return (
                            <CartCart 
                                key={index} 
                                productId={item.productId} 
                                qty={item.qty} 
                            />)
                    })
                }
            </div>
            {cart.length === 0 && (
                <div className="text-gray-500 text-center mt-4">Your cart is empty.</div>
            )}
            <div className="mt-4 flex flex-row ">
                
                <button 
                    onClick={clearCart} 
                    className="px-4 py-2 bg-red-600 text-white border-none rounded cursor-pointer hover:bg-red-700 transition-colors"
                >
                    Clear Cart
                </button>
                <button className="px-4 py-2 bg-red-600 text-white border-none rounded cursor-pointer hover:bg-red-700 transition-colors ml-4">
                    Checkout

                </button>
                </div>

        </div>
    );
}