import React, { useState } from 'react'
import { FaTimes,FaEyeSlash,FaEye  } from "react-icons/fa";
import { useNavigate ,Link} from 'react-router-dom';
import toast from 'react-hot-toast'

const Login = () => {
    const navigate=useNavigate();
    const [showPassword,setShowPassword]=useState();
    const [login,setLogin]=useState({loginEmail:"",loginPass:""})

    async function handleForm(e){
      e.preventDefault();
      console.log(login);
      try {
        const response=await fetch("/api/loginuser",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(login),
        })
        const result=await response.json();
        console.log(result)
        if(response.ok){
          if(result.data && result.data.userEmail=='admin@gmail.com'){
            navigate("/admin/dashboard")
          }else{
            console.log(result)
          toast.success(result.message)
          navigate("/")
          localStorage.setItem("token",result.token);
          localStorage.setItem("user",result.data._id);
          }
        }else{
          toast.error(result.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
    function handleChange(e){
      setLogin({...login,[e.target.name]:e.target.value})
    }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50'>
      <div className='bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative mx-4'>
        <button onClick={() => { navigate("/") }}
            className='absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl'>
            <FaTimes/>
        </button>
        <h2 className='text-2xl font-bold mb-4 text-green-600 text-center'>Login To Continue..😍</h2>
        <form action="" onSubmit={handleForm}>
            <label  htmlFor="" className='block text-sm text-gray-700 mb-2'>Email</label>
            <input onChange={handleChange} value={login.loginEmail} type="email" name="loginEmail" id="" placeholder="you@example.com" className='w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500' />
            <label htmlFor="" className='block text-sm text-gray-700 mb-2'>Passowrd</label>
            <div className='relative'>
            <input onChange={handleChange} value={login.loginPass} type={showPassword? "password":"text"} name="loginPass" id="" placeholder="******" className='w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500' />
            <button type='button' onClick={() => { setShowPassword(!showPassword) }} className='absolute top-4
            right-3 text-gray-500 hover:text-green-600'>{showPassword ? <FaEyeSlash/>:<FaEye/>}
            </button>
            </div>
            <button type='submit' className='w-full bg-green-600 hover:bg-green-800 text-white rounded font-semibold py-3 mt-6'>Login</button>
        </form>
        <p className='text-sm text-center text-gray-600 mt-5'>
            Don't have account 
            <Link to={"/reg"} className='text-green-600 hover:underline'> Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
