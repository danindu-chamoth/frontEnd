import { useEffect, useState } from "react";
import { clearCard, loadCard,deleteItem } from "../../utils/cardFunction"; // Assuming you have a utility function to load the cart
import CartCart from "../../components/cartCart"; // Assuming you have a CartCart component to display each item in the cart
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Card(){

    const [cart, setCart] = useState([]); // Assuming you have a utility function to load the cart
    const [total, setTotal] = useState(0); // Assuming you meant labelTotal instead of labealTotal
    const [labelTotal, setLabelTotal] = useState(0); // Assuming you meant labelTotal instead of labealTotal
    const navigate = useNavigate(); // Navigation hook to programmatically navigate

    useEffect(() => {
        console.log("Cart Items:", loadCard());
        setCart(loadCard())
        // Use POST request to send cart data to get quote
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/quote`,
            {orderedItems: loadCard()}).then((response) => {
                
                if(response.data && response.data.totalPrice){
                    setTotal(response.data.totalPrice);
                    setLabelTotal(response.data.labelTotal);
                    console.log("Total Price:", response.data);
                }else{
                    console.error("Invalid response data:", response.data);
                }

                
            }).catch((error) => {
                console.error("Error fetching total price:", error);
            })
        
    }, [])

    function onOrderCheckOutClick(){
    
    navigate("/shipping", {          
        state: {
            items: loadCard()  // Use the current cart state instead of loadCard()
        }
    });
}

    function clearCart(){
        clearCard();
        setCart([]);
    }

    
    return (
        <div className="w-full max-w-4xl mx-auto h-full bg-white shadow-xl rounded-lg border border-gray-200">
            {/* Header Section */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4">
                <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Shopping Cart</h1>
                <p className="text-sm text-gray-600 mt-1">Review your selected items before checkout</p>
            </div>
            
            {/* Cart Items Section */}
            <div className="px-6 py-4 min-h-96">
                {cart.length > 0 ? (
                    <div className="space-y-4">
                        {cart.map((item, index) => (
                            <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                                <CartCart 
                                    productId={item.productId} 
                                    qty={item.qty} 
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 text-center">Add some items to get started with your order</p>
                    </div>
                )}
            </div>

            {/* Footer Section with Totals and Actions */}
            {cart.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
                    {/* Price Summary */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="text-gray-800 font-medium">R: {labelTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">quantity:</span>
                                <span className="text-gray-800 font-medium">x {cart.reduce((acc, item) => acc + item.qty, 0)}</span>
                                
                            </div>

                            <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                                    <span className="text-xl font-bold text-gray-900">R: {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={onOrderCheckOutClick} className="flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                            Proceed to Checkout
                        </button>
                        <button 
                            onClick={clearCart} 
                            className="sm:w-auto bg-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200 hover:border-gray-400"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}