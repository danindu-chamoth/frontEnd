import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductNotFound from '../../components/productNotFound.jsx';
import ImageSlider from "../../components/imageSlider.jsx";
import { addToCard } from "../../utils/cardFunction.js";
import toast from "react-hot-toast";

export default function ProductOverview() {

        const params = useParams();
        const paramsId = params.id; // Assuming you want to use the id from the URL
        const [productData, setProductData] = useState(null);
        const [loading, setLoading] = useState(true);
        const[status, setStatus] = useState("loding"); // loding,found,notfound

        useEffect(
            ()=>{
               axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${paramsId}`)
               .then((response) => {
                    console.log(response.data);
                    // Handle the response data as needed
                    if( response.data === null ){
                        
                        setStatus("notfound");
                    }
                    if( response.data !== null ){
                        setProductData(response.data);
                        setStatus("found");
                    }

                })
               .catch((error) => {
                    console.error("Error fetching product data:", error);
                    // Handle the error as needed
                })
            }
        ,[])

        function onAddToCartClick(){
            addToCard(productData.productId,1);
            toast.success(productData.productId +"Product added to cart successfully!");
        }


    return (
        <div className="w-full h-[calc(100vh-70px)] bg-gray-100 p-4">

            {status === "loding" && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-400 border-solid mb-2"></div>
                    <div>Loading</div>
                </div>
            )}
            {
                status == "notfound" && <ProductNotFound />
            }

            {
                status == "found" && (
                <div className="w-full h-full flex  items-center justify-center">
                    <div className="w-[35%] h-full">
                        <ImageSlider images ={productData.images}/>
                    </div>
                    <div className="w-[65%] h-full p-4 ">

                        <h1 className="text-2xl font-bold ">{productData.productName}</h1>
                        <p className="text-1xl font-bold mb-4">{productData.altNames.join("|")}</p>
                        <p className="text-gray-700 mb-4">{productData.description}</p>
                        <p className="text-lg font-semibold text-gray-800 mb-4">Price: <span className="text-black text-base ">${productData.lastPrice}</span> {(productData.price > productData.lastPrice)&&
                            <span className="text-red-300 text-sm italic line-through mr-3">${productData.price}</span> 
                            
                    }</p>
                        <button onClick={onAddToCartClick}
                        
                        className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200">
                            Add to Cart
                        </button>
                        <button className="ml-4 px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200">
                            Buy Now
                        </button>

                    </div>
                </div>
                )
            }
            
        </div>
    );
}