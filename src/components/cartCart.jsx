import axios from "axios";
import { useEffect, useState } from "react";
import { deleteItem } from "../utils/cardFunction";

export default function CartCart(props) {
    const productId = props.productId;
    const qty = props.qty;
    const [product, setProduct] = useState(null);
    const [productLoaded, setProductLoaded] = useState(false);

    useEffect(()=>{
        if(!productLoaded){
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`)
            .then((response) => {
                if(response.data != null){
                    setProduct(response.data);
                    setProductLoaded(true);
                    
                }else{
                    deleteItem(productId);
                }

                
            })
            .catch((error) => {
                console.error("Error fetching product data:", error);
            });
        }
    },[] )


  return (
    <div>
        <div className="flex flex-row w-full h-[120px] bg-white mb-4 rounded-lg shadow-md">
            <div className="w-[20%] h-full flex items-center justify-center">
                {product && (
                    <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                )}
            </div>
            <div className="w-[65%] h-full flex flex-col justify-center px-4">
                <div className="text-lg font-semibold">{product ? product.productName : "Product not found"}</div>
                <div className="text-gray-700 font-bold mt-2">Price: ${product ? product.price : "N/A"}</div>
                <div className="text-gray-600">Quantity: {qty}</div>
            </div>
            <div className="w-[20%] h-full flex items-center justify-center">
                <button 
                    onClick={() => deleteItem(productId)} 
                    className="px-4 py-2 bg-red-600 text-white border-none rounded cursor-pointer hover:bg-red-700 transition-colors"
                >
                    Remove
                </button>
            </div>
        </div>
    </div>
  );
}