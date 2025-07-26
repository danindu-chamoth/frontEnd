import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import { clearCard } from "../../utils/cardFunction";



export default function ShippingPage(){

    const navigate =useNavigate()
    const location = useLocation(); // Access the state passed from the previous page
    const cartItems = location.state?.items; // Get cart items from location state
    const [total, setTotal] = useState(0);
    const [labelTotal, setLabelTotal] = useState(0);

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            // Use POST request to send cart data to get quote
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/quote`,
                {orderedItems: cartItems}).then((response) => {
                    
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
        }
    }, [cartItems]);

    function createOrder(){

        const token = localStorage.getItem("token");
        if(token === null){
            return alert("Please login to place an order");
        }
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders",{
            orderedItems:cartItems,
            name: "Michael Fernando",
            phone: "94772119876",
            address: "789 Lake Road, Kandy, Central Province, Sri Lanka",
            email: "customer@example.com" // You may want to get this from user authentication

        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            console.log("Order placed successfully:", response.data);
            toast.success("Order placed successfully!");
            clearCard(); // Clear cart after successful order
            navigate("/product"); // Redirect to home page after successful order
            
        }).catch((error) => {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
            
        })
    }


    // Cart Item Summary Component for Checkout
function CartItemSummary({ productId, qty }) {
    const [product, setProduct] = useState(null);
    const [productLoaded, setProductLoaded] = useState(false);

    useEffect(() => {
        if (!productLoaded) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`)
                .then((response) => {
                    if (response.data != null) {
                        setProduct(response.data);
                        setProductLoaded(true);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching product data:", error);
                });
        }
    }, [productId, productLoaded]);

    if (!product) {
        return (
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
            <img 
                src={product.images[0]} 
                alt={product.productName} 
                className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-1">{product.productName}</h3>
                <p className="text-sm text-gray-600">Price: Rs. {product.price}</p>
                <p className="text-sm text-gray-600">Quantity: {qty}</p>
            </div>
        </div>
    );
}

    if(cartItems==null){
        navigate("/card"); // Redirect to card page if no items are found
        toast.error("No items in the cart. Please add items before proceeding to shipping.");
    }

    console.log("Shipping Page Items:", location.state); // Log the items passed from the cart page

    return(
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Shipping & Billing</h1>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Side - Shipping Form */}
                    <div className="lg:col-span-3">
                        {/* Contact Information */}
                        <div className="bg-white rounded-lg p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-medium text-gray-900">Contact</h2>
                                <button className="text-blue-600 text-sm font-medium">EDIT</button>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-900">danindu chamoth dampath</p>
                                <p className="text-gray-600">740684570</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Shipping Address</h2>
                            
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Address"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                            <option value="">Select Province</option>
                                            <option value="western">Western</option>
                                            <option value="central">Central</option>
                                            <option value="southern">Southern</option>
                                            <option value="northern">Northern</option>
                                            <option value="eastern">Eastern</option>
                                            <option value="north-western">North Western</option>
                                            <option value="north-central">North Central</option>
                                            <option value="uva">Uva</option>
                                            <option value="sabaragamuwa">Sabaragamuwa</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Postal code"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input 
                                        type="tel" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Phone number"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    {cartItems && cartItems.length > 0 && (
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg p-6 sticky top-6">
                                {/* Order Summary Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                                    <button onClick={() => navigate("/card")} className="hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-200"><span className="text-sm text-gray-600 hover:text-gray-800">Edit</span></button>
                                    
                                </div>

                                {/* Items */}
                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item, index) => (
                                        <CartItemSummary 
                                            key={index}
                                            productId={item.productId} 
                                            qty={item.qty} 
                                        />
                                    ))}
                                </div>

                                {/* Promotion Code */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-900 font-medium">Promotion</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter Store/Daraz Code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium">
                                            APPLY
                                        </button>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Items Total ({cartItems.reduce((acc, item) => acc + item.qty, 0)} Items)</span>
                                        <span className="text-gray-900">Rs. {labelTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-gray-900">Rs. {(total - labelTotal).toFixed(2)}</span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span className="text-gray-900">Total:</span>
                                        <span className="text-orange-600">Rs. {total.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">VAT included, where applicable</p>
                                </div>

                                {/* Proceed Button */}
                                <button onClick={createOrder} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-md transition-colors duration-200">
                                    Proceed to Pay
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}