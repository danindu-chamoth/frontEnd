import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // Function to calculate total from ordered items
    const calculateTotal = (orderedItems) => {
        if (!orderedItems || !Array.isArray(orderedItems)) {
            return 0;
        }
        return orderedItems.reduce((sum, item) => {
            const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
            const qty = item.qty || item.quantity || 1;
            return sum + (itemPrice * qty);
        }, 0);
    };

    // Function to get order total with multiple fallbacks
    const getOrderTotal = (order) => {
        // Priority 1: Use backend calculated totals if available
        if (order.totalPrice && order.totalPrice > 0) {
            return order.totalPrice;
        }
        
        if (order.total && order.total > 0) {
            return order.total;
        }
        
        // Priority 2: Calculate from items
        if (order.orderedItems && Array.isArray(order.orderedItems)) {
            if (order.labelTotal && order.labelTotal > 0) {
                if (order.totalPrice) {
                    return order.totalPrice;
                }
                
                const calculatedFromItems = calculateTotal(order.orderedItems);
                if (Math.abs(calculatedFromItems - order.labelTotal) < 0.01) {
                    return calculatedFromItems;
                }
                
                return calculatedFromItems;
            } else {
                return calculateTotal(order.orderedItems);
            }
        }
        
        return 0;
    };

    // Function to fetch current pricing for order items (similar to shipping.jsx)
    const fetchOrderQuote = async (orderedItems) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/quote`, {
                orderedItems: orderedItems
            });
            
            if (response.data && response.data.totalPrice) {
                return {
                    total: response.data.totalPrice,
                    labelTotal: response.data.labelTotal
                };
            }
        } catch (error) {
            console.error("Error fetching order quote:", error);
        }
        return null;
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            toast.error("Please login to view your orders");
            setLoading(false);
            return;
        }
        
        setLoading(true);
        
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/orders`;
        
        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            console.log("Response status:", response.status);
            
            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.text();
                    console.error("Server error response:", errorData);
                    if (errorData) {
                        // Try to parse JSON error message
                        try {
                            const parsedError = JSON.parse(errorData);
                            if (parsedError.message) {
                                errorMessage = `Backend Error: ${parsedError.message}`;
                            } else {
                                errorMessage += ` - ${errorData}`;
                            }
                        } catch (e) {
                            errorMessage += ` - ${errorData}`;
                        }
                    }
                } catch (e) {
                    console.error("Could not parse error response:", e);
                }
                throw new Error(errorMessage);
            }
            return response.json();
        }).then((data) => {
            console.log("Raw response data:", data);
            console.log("First order structure:", data[0]);
            if (data[0] && data[0].orderedItems) {
                console.log("First order items:", data[0].orderedItems);
            }
            setOrders(data);
            setLoading(false);
        }).catch((error) => {
            console.error("Error fetching orders:", error);
            
            // Provide specific error messages based on error type
            if (error.message.includes('fetch')) {
                toast.error("Cannot connect to server. Please check if the backend is running on port 3000.");
            } else if (error.message.includes('isAdmin') || error.message.includes('isadmin')) {
                toast.error("Backend Error: 'isAdmin' variable is not defined in the orders API endpoint. Please check your backend code.");
            } else if (error.message.includes('500')) {
                toast.error("Server error occurred. Please check backend logs and ensure database is connected.");
            } else if (error.message.includes('401') || error.message.includes('403')) {
                toast.error("Authentication failed. Please login again.");
                localStorage.removeItem("token");
                // Optionally redirect to login
            } else {
                toast.error(`Error fetching orders: ${error.message}`);
            }
            
            setLoading(false);
        });
    }, []);

    // Function to show order details
    const showOrderDetailsModal = async (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
        
        // Optionally fetch current pricing for the order items
        if (order.orderedItems && order.orderedItems.length > 0) {
            const currentQuote = await fetchOrderQuote(order.orderedItems);
            if (currentQuote) {
                // Update the selected order with current pricing for comparison
                setSelectedOrder(prev => ({
                    ...prev,
                    currentTotal: currentQuote.total,
                    currentLabelTotal: currentQuote.labelTotal
                }));
            }
        }
    };

    // Function to hide order details
    const hideOrderDetails = () => {
        setSelectedOrder(null);
        setShowOrderDetails(false);
    };

    // Loading component
    if (loading) {
        return (
            <div className="w-full h-[calc(100vh-70px)] bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return(
        <div className="w-full h-[calc(100vh-70px)] bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>
                
                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
                        <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                        <button 
                            onClick={() => window.location.href = '/product'} 
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => {
                                        const displayTotal = getOrderTotal(order);
                                        const itemCount = order.orderedItems ? order.orderedItems.length : 0;
                                        const totalQty = order.orderedItems ? order.orderedItems.reduce((sum, item) => sum + (item.qty || item.quantity || 0), 0) : 0;
                                        
                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">#{order.orderID || order._id?.slice(-8) || 'N/A'}</p>
                                                        <p className="text-sm text-gray-500">{order.name || 'No customer name'}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="text-sm text-gray-900">{new Date(order.date || order.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-sm text-gray-500">{new Date(order.date || order.createdAt).toLocaleTimeString()}</p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="text-sm text-gray-900">{itemCount} items</p>
                                                    <p className="text-sm text-gray-500">{totalQty} pieces total</p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="text-lg font-bold text-green-600">Rs. {displayTotal.toFixed(2)}</p>
                                                    {order.labelTotal && order.labelTotal !== displayTotal && (
                                                        <p className="text-sm text-gray-500">Subtotal: Rs. {order.labelTotal.toFixed(2)}</p>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button 
                                                        onClick={() => showOrderDetailsModal(order)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Order Details Modal */}
                {showOrderDetails && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                                    <button 
                                        onClick={hideOrderDetails}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Order Information */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Order ID</p>
                                            <p className="font-medium">#{selectedOrder.orderID || selectedOrder._id?.slice(-8) || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Date</p>
                                            <p className="font-medium">{new Date(selectedOrder.date || selectedOrder.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                selectedOrder.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                selectedOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {selectedOrder.status || 'Pending'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Customer</p>
                                            <p className="font-medium">{selectedOrder.name || 'No customer name'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ordered Items */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-4">Ordered Items</h3>
                                    {selectedOrder.orderedItems && selectedOrder.orderedItems.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedOrder.orderedItems.map((item, index) => {
                                                const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
                                                const labelPrice = item.labelTotal || item.originalPrice || itemPrice;
                                                const qty = item.qty || item.quantity || 1;
                                                const itemTotal = itemPrice * qty;
                                                const isDiscounted = labelPrice > itemPrice;
                                                
                                                return (
                                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">Product ID: {item.productId}</p>
                                                            <p className="text-sm text-gray-600">Quantity: {qty}</p>
                                                            <div className="text-sm text-gray-600">
                                                                {isDiscounted ? (
                                                                    <div>
                                                                        <span className="text-green-600 font-medium">Final Price: Rs. {itemPrice.toFixed(2)}</span>
                                                                        <span className="text-gray-400 line-through ml-2">Rs. {labelPrice.toFixed(2)}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span>Unit Price: Rs. {itemPrice.toFixed(2)}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold">Rs. {itemTotal.toFixed(2)}</p>
                                                            <p className="text-xs text-gray-500">{qty} × Rs. {itemPrice.toFixed(2)}</p>
                                                            {isDiscounted && (
                                                                <p className="text-xs text-green-600">Saved: Rs. {((labelPrice - itemPrice) * qty).toFixed(2)}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No items found for this order</p>
                                    )}
                                </div>

                                {/* Order Total */}
                                <div className="border-t pt-4">
                                    <div className="space-y-2">
                                        {selectedOrder.orderedItems && selectedOrder.orderedItems.length > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Items Total ({selectedOrder.orderedItems.reduce((acc, item) => acc + (item.qty || item.quantity || 0), 0)} Items)</span>
                                                <span className="text-gray-900">Rs. {(selectedOrder.labelTotal || calculateTotal(selectedOrder.orderedItems)).toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        {/* Show discount if labelTotal (original) > totalPrice (discounted) */}
                                        {selectedOrder.labelTotal && selectedOrder.totalPrice && selectedOrder.labelTotal > selectedOrder.totalPrice && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Discount</span>
                                                <span className="text-green-600">-Rs. {(selectedOrder.labelTotal - selectedOrder.totalPrice).toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        {/* Show additional charges if totalPrice > labelTotal */}
                                        {selectedOrder.labelTotal && selectedOrder.totalPrice && selectedOrder.totalPrice > selectedOrder.labelTotal && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Additional Charges</span>
                                                <span className="text-blue-600">Rs. {(selectedOrder.totalPrice - selectedOrder.labelTotal).toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        {/* Show no additional charges if totals are equal or missing */}
                                        {(!selectedOrder.labelTotal || !selectedOrder.totalPrice || selectedOrder.labelTotal === selectedOrder.totalPrice) && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Additional Charges</span>
                                                <span className="text-gray-500">Rs. 0.00</span>
                                            </div>
                                        )}
                                        
                                        <hr className="border-gray-200" />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-gray-900">Order Total:</span>
                                            <span className="text-orange-600">Rs. {getOrderTotal(selectedOrder).toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">VAT included, where applicable</p>
                                        
                                        {/* Show current pricing if available and different from order total */}
                                        {selectedOrder.currentTotal && selectedOrder.currentTotal !== getOrderTotal(selectedOrder) && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-600 font-medium mb-2">Current Pricing (if ordered today):</p>
                                                <div className="space-y-1">
                                                    {selectedOrder.currentLabelTotal && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-blue-700">Current Subtotal:</span>
                                                            <span className="text-blue-700">Rs. {selectedOrder.currentLabelTotal.toFixed(2)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span className="text-blue-700">Current Total:</span>
                                                        <span className="text-blue-700">Rs. {selectedOrder.currentTotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-600">Price difference:</span>
                                                        <span className={`font-medium ${
                                                            selectedOrder.currentTotal > getOrderTotal(selectedOrder) 
                                                                ? 'text-red-600' 
                                                                : 'text-green-600'
                                                        }`}>
                                                            {selectedOrder.currentTotal > getOrderTotal(selectedOrder) ? '+' : ''}
                                                            Rs. {(selectedOrder.currentTotal - getOrderTotal(selectedOrder)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Shipping Information */}
                                {(selectedOrder.address || selectedOrder.phone || selectedOrder.email) && (
                                    <div className="mt-6 bg-blue-50 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">Shipping Information</h4>
                                        {selectedOrder.address && <p className="text-sm text-gray-700">Address: {selectedOrder.address}</p>}
                                        {selectedOrder.phone && <p className="text-sm text-gray-700">Phone: {selectedOrder.phone}</p>}
                                        {selectedOrder.email && <p className="text-sm text-gray-700">Email: {selectedOrder.email}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
