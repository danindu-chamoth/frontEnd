import  { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';





export default function LoginPage() {

    // Declare a state variable for the email input
    // Initialized with a default value "Your email"
    const [email,setEmail] = useState("Youre email");

    // Declare a state variable for the password input
    // Initialized with an empty string
    const [password,setPassword] = useState("");

    function login(){
        axios.post(import.meta.env.VITE_BACKEND_URL +"/api/User/loging",{
            email:email , // Use the email state variable
         password:password // Use the password state variable

        }).then((res)=>{
            console.log(res);
            if(res.data.user ==null){
                toast.error(res.data.message); // Show an error toast if user is not found
                return  // Alert if user is not found
            }
            toast.success("Login successful"); // Show a success toast on successful login

            localStorage.setItem('token',res.data.token); // Store the token in local storage
            if(res.data.user.type =="admin"){
                window.location.href = "/admin"; // Redirect to admin page if user is an admin
            }
            else{
                window.location.href = "/"; // Redirect to home page if user is not an admin
            }
        })
        console.log(email);
    }
    
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded border max-w-md w-full">
                <div className="text-center mb-6">
                    <img 
                        src='/logo.png' 
                        className='w-20 h-20 rounded mx-auto mb-4' 
                    />
                    <h1 className="text-xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Please sign in</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input 
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email === "Youre email" ? "" : email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="password">
                            Password
                        </label>
                        <input 
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button 
                        type="button"
                        onClick={login}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Sign In
                    </button>
                </div>

                <div className="text-center mt-4">
                    <p className="text-gray-600 text-sm">
                        Don't have an account? 
                        <a href="#" className="text-blue-500 hover:underline ml-1">
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
 