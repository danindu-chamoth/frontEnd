import { useEffect, useState } from "react";
import axios from "axios";
import { 
    FaShoppingCart, 
    FaUsers, 
    FaBox, 
    FaDollarSign, 
    FaArrowUp, 
    FaArrowDown,
    FaExclamationTriangle,
    FaChartLine,
    FaEye
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function AdminDashBoard() {
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        recentOrders: [],
        lowStockProducts: [],
        topSellingProducts: [],
        monthlyRevenueData: Array(12).fill(0)
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month'); // week, month, year
    

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
            // Debug: log order dates and monthly revenue data
            console.log('Orders:', orders.map(o => ({id: o.orderID, createdAt: o.createdAt, date: o.date, total: o.totalPrice || o.total || calculateOrderTotal(o)})));

            console.log('Monthly Revenue Data:', monthlyRevenueData);
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            // Fetch all required data concurrently
            const [
                productsRes,
                ordersRes,
                customersRes
            ] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Product`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/User/Coustomer`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const products = productsRes.data || [];
            const orders = ordersRes.data || [];
            const customers = customersRes.data || [];

            // Calculate revenue
            const totalRevenue = orders.reduce((sum, order) => {
                return sum + (order.totalPrice || order.total || calculateOrderTotal(order));
            }, 0);

            // Calculate monthly revenue for last 12 months
            const now = new Date();
            const monthlyRevenueData = Array(12).fill(0);
            orders.forEach(order => {
                let orderDate;
                if (order.createdAt || order.date) {
                    orderDate = new Date(order.createdAt || order.date);
                } else {
                    orderDate = new Date(); // fallback to now if missing
                }
                const yearDiff = now.getFullYear() - orderDate.getFullYear();
                let monthDiff = now.getMonth() - orderDate.getMonth() + yearDiff * 12;
                if (monthDiff >= 0 && monthDiff < 12) {
                    monthlyRevenueData[11 - monthDiff] += (order.totalPrice || order.total || calculateOrderTotal(order));
                }
            });

            // Monthly revenue (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const monthlyRevenue = orders
                .filter(order => new Date(order.createdAt || order.date) >= thirtyDaysAgo)
                .reduce((sum, order) => {
                    return sum + (order.totalPrice || order.total || calculateOrderTotal(order));
                }, 0);

            // Get recent orders (last 5)
            const recentOrders = orders
                .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
                .slice(0, 5);

            // Find low stock products (stock < 20)
            const lowStockProducts = products.filter(product => (product.stoke || product.stock) < 20);

            // Calculate top selling products (mock data for now)
            const topSellingProducts = products.slice(0, 5);

            setDashboardData({
                totalProducts: products.length,
                totalOrders: orders.length,
                totalCustomers: customers.length,
                totalRevenue,
                monthlyRevenue,
                recentOrders,
                lowStockProducts,
                topSellingProducts,
                monthlyRevenueData
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateOrderTotal = (order) => {
        if (!order.orderedItems || !Array.isArray(order.orderedItems)) {
            return 0;
        }
        return order.orderedItems.reduce((sum, item) => {
            const itemPrice = item.price || item.unitPrice || item.productPrice || 0;
            const qty = item.qty || item.quantity || 1;
            return sum + (itemPrice * qty);
        }, 0);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
                <div className="text-center mt-4">
                    <h3 className="text-lg font-medium text-gray-700">Loading Dashboard...</h3>
                    <p className="text-sm text-gray-500">Please wait</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <MdDashboard className="mr-3 text-blue-600" />
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">Overview of your store performance</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <select 
                            value={dateRange} 
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="year">Last Year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                            <p className="text-2xl font-bold">{formatCurrency(dashboardData.totalRevenue)}</p>
                            <div className="flex items-center mt-2">
                                <FaArrowUp className="text-green-100 mr-1" />
                                <span className="text-green-100 text-sm">+12.5% from last month</span>
                            </div>
                        </div>
                        <div className="bg-green-500 bg-opacity-50 p-3 rounded-full">
                            <FaDollarSign className="text-2xl" />
                        </div>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                            <p className="text-2xl font-bold">{dashboardData.totalOrders}</p>
                            <div className="flex items-center mt-2">
                                <FaArrowUp className="text-blue-100 mr-1" />
                                <span className="text-blue-100 text-sm">+8.2% from last month</span>
                            </div>
                        </div>
                        <div className="bg-blue-500 bg-opacity-50 p-3 rounded-full">
                            <FaShoppingCart className="text-2xl" />
                        </div>
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Total Products</p>
                            <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
                            <div className="flex items-center mt-2">
                                <FaArrowUp className="text-purple-100 mr-1" />
                                <span className="text-purple-100 text-sm">+5.1% from last month</span>
                            </div>
                        </div>
                        <div className="bg-purple-500 bg-opacity-50 p-3 rounded-full">
                            <FaBox className="text-2xl" />
                        </div>
                    </div>
                </div>

                {/* Total Customers */}
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Total Customers</p>
                            <p className="text-2xl font-bold">{dashboardData.totalCustomers}</p>
                            <div className="flex items-center mt-2">
                                <FaArrowUp className="text-orange-100 mr-1" />
                                <span className="text-orange-100 text-sm">+15.3% from last month</span>
                            </div>
                        </div>
                        <div className="bg-orange-500 bg-opacity-50 p-3 rounded-full">
                            <FaUsers className="text-2xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Monthly Revenue Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Monthly Revenue</h3>
                        <FaChartLine className="text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">
                        {formatCurrency(dashboardData.monthlyRevenue)}
                    </div>
                    <p className="text-gray-600 text-sm">Last 30 days</p>
                    
                    {/* Beautiful Animated Bar Chart */}
                    <div className="mt-6 h-48 bg-gradient-to-t from-gray-50 to-white rounded-lg p-4 border border-gray-100">
                        {dashboardData.monthlyRevenueData.every(val => val === 0) ? (
                            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                                No revenue data for the last 12 months
                            </div>
                        ) : (
                        <div className="h-full flex items-end justify-between gap-2">
                            {/* Generate 12 bars representing months */}
                            {Array.from({ length: 12 }, (_, index) => {
                                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                const currentMonth = new Date().getMonth();
                                const monthIndex = (currentMonth - 11 + index + 12) % 12;
                                const isCurrentMonth = index === 11;
                                const monthRevenue = dashboardData.monthlyRevenueData[index];
                                const maxRevenue = Math.max(...dashboardData.monthlyRevenueData, 1);
                                const height = Math.max(20, (monthRevenue / maxRevenue) * 100);
                                return (
                                    <div key={index} className="flex flex-col items-center flex-1 group">
                                        <div className="relative w-full mb-2">
                                            <div 
                                                className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${
                                                    isCurrentMonth 
                                                        ? 'bg-gradient-to-t from-blue-500 to-blue-400 shadow-lg' 
                                                        : 'bg-gradient-to-t from-gray-300 to-gray-200 hover:from-blue-300 hover:to-blue-200'
                                                }`}
                                                style={{ 
                                                    height: `${height}%`,
                                                    animationDelay: `${index * 100}ms`
                                                }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                    {formatCurrency(monthRevenue)}
                                                </div>
                                                {/* Shine effect */}
                                                <div className={`w-full h-full rounded-t-lg ${isCurrentMonth ? 'bg-gradient-to-r from-transparent via-white to-transparent opacity-20' : ''}`}></div>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-medium ${isCurrentMonth ? 'text-blue-600' : 'text-gray-500'}`}>
                                            {monthNames[monthIndex]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        )}
                    </div>
                    
                    {/* Chart Legend */}
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded-full mr-2"></div>
                                <span className="text-gray-600">Current Month</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-t from-gray-300 to-gray-200 rounded-full mr-2"></div>
                                <span className="text-gray-600">Previous Months</span>
                            </div>
                        </div>
                        <div className="text-green-600 font-medium flex items-center">
                            <FaArrowUp className="mr-1" />
                            +12.5% growth
                        </div>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                        {dashboardData.topSellingProducts.length > 0 ? (
                            dashboardData.topSellingProducts.map((product, index) => (
                                <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{product.productName}</p>
                                            <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-800">Stock: {product.stoke}</p>
                                        <p className="text-xs text-gray-500">ID: {product.productId}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <FaBox className="text-4xl mb-2 mx-auto" />
                                <p>No products available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders and Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                        {dashboardData.recentOrders.length > 0 ? (
                            dashboardData.recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div>
                                        <p className="font-medium text-gray-800">Order #{order._id?.slice(-6)}</p>
                                        <p className="text-sm text-gray-600">
                                            {order.customerName || order.email || 'Unknown Customer'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(order.createdAt || order.date)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-800">
                                            {formatCurrency(order.totalPrice || order.total || calculateOrderTotal(order))}
                                        </p>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                            order.status === 'completed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <FaShoppingCart className="text-4xl mb-2 mx-auto" />
                                <p>No recent orders</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h3>
                        <FaExclamationTriangle className="text-orange-500" />
                    </div>
                    <div className="space-y-3">
                        {dashboardData.lowStockProducts.length > 0 ? (
                            dashboardData.lowStockProducts.map((product) => (
                                <div key={product._id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">{product.productName}</p>
                                        <p className="text-sm text-gray-600">ID: {product.productId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-orange-600">
                                            Stock: {product.stoke || product.stock}
                                        </p>
                                        <span className="inline-block px-2 py-1 text-xs bg-orange-200 text-orange-800 rounded-full">
                                            Low Stock
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <FaBox className="text-4xl mb-2 mx-auto text-green-400" />
                                <p>All products have sufficient stock</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                        <FaBox className="text-blue-600 mr-2" />
                        <span className="text-blue-800 font-medium">Add New Product</span>
                    </button>
                    <button className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                        <FaEye className="text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">View All Orders</span>
                    </button>
                    <button className="flex items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                        <FaUsers className="text-purple-600 mr-2" />
                        <span className="text-purple-800 font-medium">Manage Customers</span>
                    </button>
                </div>
            </div>
        </div>
    );
}