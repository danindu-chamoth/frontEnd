import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('Sign up attempt:', formData);
        // After successful registration, redirect to login
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded border max-w-md w-full">
                <div className="mb-4">
                    <Link 
                        to="/" 
                        className="text-blue-500 hover:underline"
                    >
                        ← Back to Home
                    </Link>
                </div>
                
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold mb-2">Join Us Today</h2>
                    <p className="text-gray-600">Create your account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input 
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <input 
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <input 
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <input 
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="terms"
                            className="h-4 w-4"
                            required
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                            I agree to the 
                            <a href="#" className="text-blue-500 hover:underline"> Terms and Conditions</a>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Create Account
                    </button>
                </form>
                
                <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm">
                        Already have an account? 
                        <Link to="/login" className="text-blue-500 hover:underline ml-1">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>   
    );
}
