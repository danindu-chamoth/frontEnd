import { useEffect, useState } from "react";
import axios from "axios";


export default function AdminCustomersPage(){
    const  [coustomers,setCoustomers] =useState([
        {
        "_id": "68713b78ee24d935436e4698",
        "email": "Jane@1example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "password": "$2b$10$Z.doytahRaNvq/cL0K99huDS4Bu80FZMYarNtAW7KevqWpG7d/bva",
        "isBlocked": false,
        "type": "customer",
        "profilePicture": "https://res.cloudinary.com/dz4qj1x8h/image/upload/v1706266460/DefaultProfilePicture.png",
       
    }
    ]);

    useEffect(()=>{
        axios.get(import.meta.env.VITE_BACKEND_URL +"/api/User/Coustomer")
        .then((res)=>{
            setCoustomers(res.data);
        }).catch((error)=>{
            console.error("Error fetching customers:", error);
        })
    },[])
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Customers</h1>
            
            <div className="grid gap-4 mb-6">
                {
                    coustomers.map((customer) => {
                        return (
                            <div key={customer._id} className="bg-white p-4 rounded border">
                                <h2 className="font-bold">{customer.firstName} {customer.lastName}</h2>
                                <p className="text-gray-600">Email: {customer.email}</p>
                                <p className="text-gray-600">Type: {customer.type}</p>
                                <img src={customer.profilePicture} alt={`${customer.firstName} ${customer.lastName}`} className="w-16 h-16 rounded mt-2" />
                            </div>
                        );
                    })
                }
            </div>
            
            <div className="bg-white rounded border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            coustomers.map((customer) => {
                                return (
                                    <tr key={customer._id} className="border-t">
                                        <td className="px-4 py-2">{customer.firstName} {customer.lastName}</td>
                                        <td className="px-4 py-2">{customer.email}</td>
                                        <td className="px-4 py-2">{customer.type}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded text-sm ${customer.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {customer.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}