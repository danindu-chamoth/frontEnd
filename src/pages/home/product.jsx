import axios from "axios";
import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";

export default function Product() {
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState("loading");
    

    useEffect(
        () => {

            if(loading === "loading"){

                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`)
                .then((res)=>{
                    
                    setProductData(res.data);
                    setLoading("loaded");
                }).catch((err)=> toast.error("Error fetching product data")
                )
            }

            
        }, [loading]
    )


    return (
        <div className="w-full h-full p-10  flex flex-wrap  overflow-y-scroll justify-center ">
            {productData.map((product) => (
                <ProductCard product={product} />
            ))}
        </div>
    );
}