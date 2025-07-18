import { useEffect, useState } from "react";
import { clearCard, loadCard } from "../../utils/cardFunction"; // Assuming you have a utility function to load the cart

export default function Card(){

    const [cart, setCart] = useState([]);

    useEffect(() => {

        setCart(loadCard())
        
    }, [clearCart])

    function clearCart(){
        clearCard( )
    }
    return (
        <div className="flex flex-col w-full h-full bg-gray-100 p-4">
            <div className="text-2xl font-bold mb-4">Shopping Cart</div>
            <button 
                onClick={clearCart} 
                className="px-4 py-2 bg-red-600 text-white border-none rounded cursor-pointer mb-4 hover:bg-red-700 transition-colors"
            >
                Clear Cart
            </button>
            <div className="w-full h-full flex flex-col">
                {
                    cart.map((item) => (
                        <span  className="bg-yellow-200 m-2 p-2 rounded inline-block">
                            {item.productId} X {item.qty}
                            
                        </span>
                    ))
                }
            </div>
        </div>
    );
}