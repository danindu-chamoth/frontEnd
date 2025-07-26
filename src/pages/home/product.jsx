import axios from "axios";
import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";

export default function Product() {
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState("loading");
    const [productsLoaded, setProductLoaded] = useState(false);
   
    

    useEffect(
        () => {

            if(loading === "loading" && !productsLoaded) {

                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`)
                .then((res)=>{
                    
                    setProductData(res.data);
                    setLoading("loaded");
                    setProductLoaded(true);
                    
                }).catch((err)=> toast.error("Error fetching product data")
                )
            }

            
        }, [loading, productsLoaded]
    )

    function handleSearch(e) {
        const query =e.target.value;
        if (query === "") {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`)
                .then((res)=>{
                    
                    setProductData(res.data);
                    setLoading("loaded");
                    setProductLoaded(true);
                    
                }).catch((err)=> toast.error("Error fetching product data")
                )
        }else{
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Product/search/${query}`)
                .then((res)=>{
                    
                    setProductData(res.data);
                    setLoading("loaded");
                    setProductLoaded(true);
                    
                }).catch((err)=> toast.error("Error fetching product data")
                )
        }
    }



    return (
        <>
        {  loading === "loaded" &&
            <div className="w-full h-full p-10 flex flex-wrap overflow-y-scroll justify-center bg-gray-50 min-h-screen relative">
            <div className="w-full flex justify-center items-center mb-6 relative">
                <input
                    type="text" onChange={handleSearch}
                    className="border border-gray-300 rounded-md p-2 mb-4 w-1/3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Search products..."
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {productData.map((product) => (
                    <ProductCard
                        key={product.id || product._id}
                        product={product}
                        className="hover:scale-105 transition-transform duration-200"
                    />
                ))}
            </div>
        </div>
        }
        {loading === "loading" && 
        <div className="w-full h-full flex justify-center items-center bg-gray-50 min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
        }
        {loading === "null" &&
        <div className="w-full h-full flex justify-center items-center bg-gray-50 min-h-screen">
            <p className="text-gray-500">No products found</p>
        </div>
        }

        </>
        
    );
}