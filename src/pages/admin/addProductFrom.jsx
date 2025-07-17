import  { useState } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FileUploadToSupabase from '../../utils/mediaUpload.js';
export default function AdminProductPage() {

    const [productId, setProductsID] = useState("");
    const [productName, setProductName] = useState("");
    const [altNames, setAltNames] = useState("");
   
    const [imageFiles, setImageFiles] = useState([]);
    const [price, setPrice] = useState("");
    const [lastPrice, setLastPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    async function handleButtonClick() {
        
        const alternativeName = altNames.split(",");
        
        const promisesArray=[]

        for(let i=0;i< imageFiles.length;i++){

            promisesArray[i] = FileUploadToSupabase(imageFiles[i])
        }

        const imageUrls = await Promise.all(promisesArray);
        





        const productData = {
            productId : productId,
            productName : productName,
            altNames : alternativeName,
            images : imageUrls,
            price : price,
            lastPrice : lastPrice,
            stoke : stock,
            description : description
        }
        const token = localStorage.getItem("token");

        try{

            await axios.post(import.meta.env.VITE_BACKEND_URL +"/api/Product/", productData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }) 
        navigate("/admin/Product");
        toast.success('Successfully toasted!')
    } catch(err){
            toast.error( err.response.data.message.errorResponse.errmsg);
        }


        
    }
    

   

    return(
        <div className="p-4">
            <div className="bg-white rounded border max-w-4xl mx-auto">
                <div className="bg-blue-500 text-white p-4">
                    <h1 className="text-2xl font-bold text-center">Add New Product</h1>
                    <p className="text-center mt-1">Fill in the details to add a new product</p>
                </div>
                
                <div className="p-6">
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="productId">
                                    Product ID
                                </label>
                                <input 
                                    type="text" 
                                    id="productId"
                                    placeholder="Enter product ID"
                                    value={productId} onChange={(e) => setProductsID(e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="productName">
                                    Product Name
                                </label>
                                <input 
                                    type="text" 
                                    id="productName"
                                    placeholder="Enter product name"
                                    value={productName} onChange={(e) => setProductName(e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="altNames">
                                Alternative Names
                            </label>
                            <input 
                                type="text" 
                                id="altNames"
                                placeholder="Enter alternative names (comma-separated)"
                                value={altNames} onChange={(e) => setAltNames(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="images">
                                Product Images
                            </label>
                            <input 
                                type="file" 
                                id="images"
                                onChange={ (e) => {
                                    setImageFiles(e.target.files);
                                }}
                                multiple
                                accept="image/*"
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="price">
                                    Price ($)
                                </label>
                                <input 
                                    type="number" 
                                    id="price"
                                    placeholder="0.00"
                                    step="0.01"
                                    value={price} onChange={(e) => setPrice(e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="lastPrice">
                                    Last Price ($)
                                </label>
                                <input 
                                    type="number" 
                                    id="lastPrice"
                                    placeholder="0.00"
                                    step="0.01"
                                    value={lastPrice} onChange={(e) => setLastPrice(e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="stock">
                                    Stock Quantity
                                </label>
                                <input 
                                    type="number" 
                                    id="stock"
                                    placeholder="0"
                                    min="0"
                                    value={stock} onChange={(e) => setStock(e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="description">
                                Product Description
                            </label>
                            <textarea 
                                id="description"
                                placeholder="Enter detailed product description..."
                                rows="4"
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="text-center pt-4">
                            <button 
                                type="button"
                                onClick={handleButtonClick}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}