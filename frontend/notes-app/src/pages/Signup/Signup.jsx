import React from 'react'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'

const Signup = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repassword, setRepassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    // handle signup logic
    const handleSignup = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)){
            setError("Please enter a valid email")
            return;
        }

        if(!password){
            setError("Please enter a password")
            return;
        }

        if(repassword !== password){
            setError("Passwords do not match")
            return;
        }

        if(password.length < 8){
            setError("Password must be at least 8 characters long")
            return;
        }
        setError("");
        
                try {
                    const response = await axiosInstance.post("/create-account",{
                        fullName: name,
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
                <h4 className='text-2xl font-medium text-black py-2'>Sign Up</h4>
            </div>
            <form className='flex flex-col' onSubmit={handleSignup}>
                <input type='text' className='border border-gray-300 p-2 rounded mb-4' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}></input>
                <input type='email' className='border border-gray-300 p-2 rounded mb-4' 
                placeholder='Email' value = {email} onChange={(e)=>setEmail(e.target.value)}></input>

                <input type='password' className='border border-gray-300 p-2 rounded mb-4' 
                placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                <input type='password' className='border border-gray-300 p-2 rounded mb-4' 
                placeholder='Confirm Password' value={repassword} onChange={(e)=>setRepassword(e.target.value)}></input>
                {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

                <div>
                    <span>Already have an account?</span>
                    <Link to="/login" className='text-blue-500 hover:underline mb-4'> Login</Link>
                </div>

                <button type='submit' 
    className='w-full bg-blue-500 text-white hover:bg-blue-600 hover:scale-102 transition-transform duration-500 p-2 rounded'>Sign Up</button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
