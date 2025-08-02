import React, { useState } from 'react'
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { FaRegUserCircle, FaShoppingCart, FaSearch, FaTimes, FaHome } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdContactSupport } from "react-icons/md";
import SearchData from './SearchData';
import { IoMdLogOut } from "react-icons/io";
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate()
  let token = localStorage.getItem("token")
  const handleLogOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Log Out Successfully")
    navigate("/")
  }
  console.log(showSearch)
  return (
    <nav className='bg-gradient-to-r from-green-100 to-white shadow-md fixed top-0 left-0 right-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* logo */}
          <div>
            <img src={logo} alt="" className='h-16 w-auto' />
          </div>
          {/* search bar */}
          <div className='flex-1 mx-4'>
            <div className='relative'>
              <input type="search" name="" id="" onFocus={() => { setShowSearch(true) }} readOnly
                className='w-full bg-gray-200 rounded-full ps-4 pe-10 py-2 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500' />
              <FaSearch className='absolute right-3 top-3 text-sm text-gray-500' />
            </div>
          </div>
          {/* Desktop Menu items */}
          <div className='hidden md:flex space-x-6 items-center'>
            <Link to={"/"} className='text-xl hover:text-green-600'><FaHome /></Link>

            <Link to={"/cart"}>
              <FaShoppingCart className='text-xl hover:text-green-600' />
            </Link>
            <Link to={"/contact"}>
              <MdContactSupport className='text-xl hover:text-green-600' />
            </Link>
            {
              !token ? (<Link to={"/login"}>
              <FaRegUserCircle className='text-xl hover:text-green-600' />
            </Link>) : (<IoMdLogOut
            onClick={handleLogOut} className='text-2xl font-extrabold text-red-500 hover:cursor-pointer hover:text-red-800'
            />)
            }
            
          </div>
          {/* mobile toggle */}
          <div className='md:hidden flex items-center'>
            <button onClick={toggleMenu}>
              {isOpen ? <FaTimes /> : <GiHamburgerMenu />}
            </button>
          </div>
        </div>
      </div>
      {/* mobile menu items */}
      {
        isOpen && (
          <div className='md:hidden bg-white px-4 pt-2 pb-4 shadow-md'>
            <Link to={"/"} className='block text-gray-700 hover:text-green-600'>Home</Link>
            <Link className='block text-gray-700 hover:text-green-600'>Search</Link>
            <Link to={"/cart"} className='block text-gray-700 hover:text-green-600'>Cart</Link>
            <Link to={"/contact"} className='block text-gray-700 hover:text-green-600'>Contact</Link>
            {
              !token ? (<Link to={"/login"} className='block text-gray-700 hover:text-green-600'>User</Link>):(<button onClick={handleLogOut} className='block text-red-500 font-semibold'>LogOut</button>)
            }
            
          </div>
        )
      }
      {showSearch && <SearchData onClose={setShowSearch} />}
    </nav>

  )
}

export default Navbar
