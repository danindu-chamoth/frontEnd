import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductNotFound from '../../components/productNotFound.jsx';
import ImageSlider from "../../components/imageSlider.jsx";
import { addToCard } from "../../utils/cardFunction.js";
import toast from "react-hot-toast";


export default function ProductOverview() {

        const params = useParams();
        const paramsId = params.id; // Assuming you want to use the id from the URL
        const [productData, setProductData] = useState(null);
        const[status, setStatus] = useState("loding"); // loding,found,notfound
        const navigate = useNavigate();

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

        function onBuyNowClick(){
            navigate("/shipping", { 
                state: { 
                    items: [{
                        productId: productData.productId,
                        qty: 1
                    }]
                } 
            });
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
                <div className="w-full h-full flex flex-col lg:flex-row md:flex-row items-center justify-center gap-4">

                     {/* Image Section */}
                     <div className="w-full lg:w-[35%] md:w-[40%] lg:h-full md:h-full h-[300px] sm:h-[350px] ">
                        <ImageSlider images ={productData.images}/>
                    </div> 
                    
                    {/* Mobile Only Title and Price */}
                    <div className="w-full lg:hidden md:hidden px-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">{productData.productName}</h1>
                        <p className="text-lg font-semibold text-gray-800 text-center mb-4">
                            Price: <span className="text-black text-base">${productData.lastPrice}</span> 
                            {(productData.price > productData.lastPrice) &&
                                <span className="text-red-300 text-sm italic line-through ml-2">${productData.price}</span> 
                            }
                        </p>
                    </div>
                   
                    {/* Product Details Section */}
                    <div className="w-full lg:w-[65%] md:w-[60%] lg:h-full md:h-full h-auto p-4 flex flex-col justify-start">

                        {/* Desktop/Tablet Only Title */}
                        <h1 className="text-2xl md:text-3xl font-bold hidden lg:block md:block mb-2">{productData.productName}</h1>
                        
                        {/* Alternative Names */}
                        <p className="text-base sm:text-lg font-bold mb-4 text-center lg:text-left md:text-left">
                            {productData.altNames.join(" | ")}
                        </p>
                        
                        {/* Description */}
                        <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed text-center lg:text-left md:text-left">
                            {productData.description}
                        </p>
                        
                        {/* Desktop/Tablet Only Price */}
                        <p className="text-lg font-semibold text-gray-800 mb-6 hidden lg:block md:block">
                            Price: <span className="text-black text-base">${productData.lastPrice}</span> 
                            {(productData.price > productData.lastPrice) &&
                                <span className="text-red-300 text-sm italic line-through ml-2">${productData.price}</span> 
                            }
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center lg:items-start md:items-start">
                            <button 
                                onClick={onAddToCartClick}
                                className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium"
                            >
                                Add to Cart
                            </button>
                            <button onClick={onBuyNowClick} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105">
                                Buy Now
                            </button>
                        </div>

                    </div>
                </div>
                )
            }
            
        </div>
    );
}