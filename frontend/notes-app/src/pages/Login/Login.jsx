import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    // handle login logic
    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)){
            setError("Please enter a valid email")
            return;
        }

        if(!password){
            setError("Please enter a password")
            return;
        }

        if(password.length < 8){
            setError("Password must be at least 8 characters long")
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post("/login",{
                email: email,
                password: password
            })

            if(response.data && response.data.accessToken){
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (err) {
            if(err.response && err.response.data && err.response.data.message){
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    }

  return (
    <div>
      <Navbar />

      <div className='flex justify-center items-center h-[60vh]'>
        <div className=' w-96 p-7 bg-white rounded-lg drop-shadow'>
            <div className='flex justify-center'>
                <h4 className='text-2xl font-medium text-black py-2'>Login</h4>
            </div>
            <form className='flex flex-col' onSubmit={handleLogin}>
                <input type='email' className='border border-gray-300 p-2 rounded mb-4' 
                placeholder='Email' value = {email} onChange={(e)=>setEmail(e.target.value)}></input>

                <input type='password' className='border border-gray-300 p-2 rounded mb-4' 
                placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

                <div className='flex'>
                    <span>Don't have an account?</span>
                    <Link to="/signup" className='text-blue-500 hover:underline mb-4'> Register</Link>
                </div>
                
                <button type='submit' className='w-full bg-blue-500 text-white 
                hover:bg-blue-600 hover:scale-102 
                transition-transform duration-500 
                p-2 rounded'>Login</button>
            </form>
        </div>
      </div>
    </div>
  )
}


export default Login
