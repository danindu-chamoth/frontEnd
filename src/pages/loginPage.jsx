import  { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';





export default function LoginPage() {

    // Declare a state variable for the email input
    // Initialized with a default value "Your email"
    const [email,setEmail] = useState("Youre email");

    // Declare a state variable for the password input
    // Initialized with an empty string
    const [password,setPassword] = useState("");

    const GooglLogin =useGoogleLogin({
        onSuccess:(res)=>{
            console.log(res);
            axios.post(import.meta.env.VITE_BACKEND_URL +"/api/User/googleLogin",{
                token : res.access_token // Use the access token from the Google login response
            }).then((res)=>{
                if(res.data.message == "User created successfully"){
                    toast.success("User created successfully"); // Show a success toast if user is created
                }else{
                    localStorage.setItem('token',res.data.token); // Store the token in local storage
                    if(res.data.user.type =="admin"){
                        window.location.href = "/admin"; // Redirect to admin page if user is an admin
                    }
                    else{
                        window.location.href = "/"; // Redirect to home page if user is not an admin
                    }
                }
            })
        }
    })

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

                    <button 
                        onClick={()=>{GooglLogin()}}
                        className="w-full bg-white text-gray-700 py-2 px-4 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
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
 