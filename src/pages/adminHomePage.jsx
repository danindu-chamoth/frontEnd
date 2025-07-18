import{Link,Routes,Route } from "react-router-dom";
import { MdDashboard, } from "react-icons/md";
import { FaShoppingCart, FaUsers, FaBox } from "react-icons/fa";
import AdminProductPage from "./admin/adminProductPage";
import AdminCustomersPage from "./admin/admiCustomersPage";
import AddProductFrom from "./admin/addProductFrom";
import AdminEditProductFrom from "./admin/adminEditProductfrom";
export default function AdminHomePage() {

    return(
        <div className="bg-gray-100 w-full h-screen flex">
            {/* Sidebar */}
            <div className="w-64 h-screen bg-gray-800 text-white">
                {/* Logo Section */}
                <div className="px-4 py-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Admin Panel</h2>
                            <p className="text-gray-400 text-sm">Management System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="px-4 py-4">
                    <div className="space-y-2">
                        <Link to="/admin/Dashboard" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                            <MdDashboard className="mr-3" />
                            <span>Dashboard</span>
                        </Link>
                        
                        <Link to="/admin/Product" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                            <FaBox className="mr-3" />
                            <span>Products</span>
                        </Link>
                        
                        <Link to="/admin/orders" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                            <FaShoppingCart className="mr-3" />
                            <span>Orders</span>
                        </Link>
                        
                        <Link to="/admin/customers" className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                            <FaUsers className="mr-3" />
                            <span>Customers</span>
                        </Link>
                    </div>
                </nav>
            </div>
            <div className="flex-1 h-screen bg-white overflow-auto">
                {/* Main Content Area */}
                <div className="p-6">
                    <Routes path="/*">
                        <Route path="/Dashboard" element={<h1> dashBoard </h1>} />
                        <Route path="/Product" element={<AdminProductPage />} />
                        <Route path="/orders" element={ <h1> order page </h1> } />
                        <Route path="/Product/addProduct" element={<AddProductFrom/>}/>
                        <Route path ="/Product/editProduct" element={<AdminEditProductFrom/>}/>
                        <Route path="/customers" element={<AdminCustomersPage/>} />
                        <Route path="*" element={
                            <div className="bg-gray-100 p-6 rounded text-center">
                                <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
                                <p className="text-gray-600">The page you're looking for doesn't exist</p>
                            </div>
                        } />
                    </Routes>
                </div>
            </div>
        </div>
    )
}
