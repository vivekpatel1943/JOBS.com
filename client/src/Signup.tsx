import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Signup() {

    const [formData, setFormData] = useState({
        email: "",
        createPassword: "",
        confirmPassword: ""
    })


    const [signupFormData, setSignupFormData] = useState({
        email: "",
        password: ""
    })

    const [passwordVisible , setPasswordVisible] = useState(false);

    const seePassword = (event:React.ChangeEvent<HTMLInputElement>) => {
        setPasswordVisible(event.target.checked);
    } 

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (formData.createPassword === formData.confirmPassword) {
            setSignupFormData({ email: formData.email, password: formData.createPassword });
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, signupFormData);

            console.log("response", response);
        } catch (err) {
            console.log("error signing up", err, ".");
        }
    }

    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-semibold text-gray-700 text-center">Create Account</h2>

                <div className="flex flex-col">
                    <label htmlFor="email" className="text-gray-600 mb-1 font-medium">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahul@gmail.com"
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    
                    
                </div>

                <div className="flex flex-col">
                    <label htmlFor="createPassword" className="text-gray-600 mb-1 font-medium">
                        Create Password
                    </label>
                    <input
                        id="createPassword"
                        name="createPassword"
                        type={`${passwordVisible ? "text" : "password"}`}
                        value={formData.createPassword}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label>
                        <input 
                        type='checkbox' 
                        onChange = {seePassword}
                        checked={passwordVisible} 
                        className='cursor-pointer'
                        />
                        <span>show password</span>
                    </label>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="text-gray-600 mb-1 font-medium">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Submit
                </button>
            </form>
        </div>

    )
}

export default Signup;