import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash, FaEdit,FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function AdminProductPage() {

    const [products, setProducts] = useState([]);
    const[productsLoad,setProdcutLoaded] = useState(false);

  

    useEffect(()=>{
        if(!productsLoad){

            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/Product")
        .then((res)=>{
            setProducts(res.data);
            setProdcutLoaded(true);
        })
        .catch((error)=>{
            console.error("Error fetching products:", error);
        }) 

        }
        
    }, [ productsLoad])


    const navigate = useNavigate();



    console.log(products);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <Link to={"/admin/Product/addProduct"} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
                    <FaPlus className="w-4 h-4"/>
                    <span>Add Product</span>
                </Link>
            </div>
            
            <div className="w-full">
                {
                    productsLoad ?
                    <div className="bg-white rounded border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left text-sm font-medium">Product ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Product Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id} className={`border-t hover:bg-gray-50 ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                            {product.productId}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold mr-3">
                                                {product.productName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                                                <div className="text-xs text-gray-500">Premium Product</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <span className="text-sm font-bold text-green-600">${product.price}</span>
                                            {product.lastPrice && (
                                                <span className="text-xs text-gray-400 line-through ml-2">${product.lastPrice}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                                            product.stoke > 100 
                                                ? 'bg-green-100 text-green-800' 
                                                : product.stoke > 50 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.stoke}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-700 truncate max-w-xs" title={product.description}>
                                            {product.description}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"

                                            onClick={() => {
                                                navigate(`/admin/Product/editProduct`,{state:{products:product}});
                                            }}
                                            
                                            >
                                                <FaEdit className="w-3 h-3" />
                                            </button>
                                            <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => {
                                                const token = localStorage.getItem('token');
                                                axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/Product/${product.productId}`, {
                                                    headers: { Authorization: `Bearer ${token}`,}

                                                }).then(() => {

                                                    toast.success("Product deleted successfully");
                                                    setProdcutLoaded(false);
                                                });
                                            }}
                                            >
                                                <FaTrash className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> 
              : <div className="flex flex-col items-center justify-center p-8">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
                    <div className="text-center mt-4">
                        <h3 className="text-lg font-medium text-gray-700">Loading Products...</h3>
                        <p className="text-sm text-gray-500">Please wait</p>
                    </div>
                </div>
                }

                

               

            </div>
        </div>
    );
} 
