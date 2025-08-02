import React, { useEffect, useState } from 'react'
import { FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { carttotalPrice, deleteCartItem, IncrementQuantity, DecrementQuantity, saveCart, fetchCart } from '../features/cartSlice/cartSlice';
import toast from 'react-hot-toast'

const Cart = () => {
    const navigate = useNavigate();
    const cartData = useSelector((state) => state.Cart.cartItems)
    const cartAllValue= useSelector((state) => state.Cart)
    const [checkingAuth,setCheckingAuth] = useState(true)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(carttotalPrice())
    },[cartData,dispatch])
    useEffect(() => {
        let userId = localStorage.getItem("user")
        let token = localStorage.getItem("token")
        if(token && userId && cartData.length > 0){
            dispatch(saveCart({
                userId:userId,
                cartItems:cartData,
                totalPrice:cartAllValue.totalPrice,
                totalQuantity:cartAllValue.totalQuantity,
            }))
        }
    },[cartData,cartAllValue,dispatch])
    useEffect(() => { 
        let token = localStorage.getItem("token")
        let userId = localStorage.getItem("user")
        if(!token){
            toast.error("Please Login to access your cart")
            navigate("/login")
            return;
        }
        if(userId){
            dispatch(fetchCart(userId))
            setCheckingAuth(false)
        }else{
            setCheckingAuth(false)
        }
    },[dispatch,navigate])
    function handlePayment(){
        const amount = cartAllValue.totalPrice
        const currency = "INR"
        const receipt = "receipt#1"
        fetch("/api/create-order",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                amount:amount,
                currency:currency,
                receipt:receipt,
            })
        })

        .then((res) => { 
            return res.json()
        })
        .then((order) => {
            const options ={
                key:"rzp_test_FGNUpC7d9ekcWj",
                amount: order.amount,
                currency: order.currency,
                name: "Quickzy",
                description:"Test Mode",
                order_id:order.id,
                handler:function(response){
                    let token=localStorage.getItem("token")
                    let userId=localStorage.getItem("user")
                    fetch("/api/verify",{
                        method:"POST",
                        headers:{"Content-Type":"application/json",
                            Authorization:`Bearer ${token}`
                        },
                        body:JSON.stringify({
                            razorpay_order_id :response.razorpay_order_id,
                            razorpay_payment_id :response.razorpay_payment_id,
                            razorpay_signature :response.razorpay_signature,
                            amount,
                            userId,
                        })
                    })
                    .then((res) => { 
                        return res.json()
                    })
                    .then((result) => { 
                        if(result.success){
                            toast.success("Payment Successfully")
                        }else{
                            toast.error("Payment Failed")
                        }
                    })
                },
                prefill:{
                    name:"Sibun",
                    email: "john.doe@example.com",
                    contact: "123456789"
                },
                theme: {
                    color: "#3399cc",
                }
            }
            const paymentObject = new window.Razorpay(options)
            paymentObject.open();
        })
    }
    if(checkingAuth){
        return <div className='fixed inset-0 justify-center items-center bg-black bg-opacity-40'>
            <div className='bg-white p-6  rounded-lg shadow-lg'>
                Loding Cart...
            </div>
        </div>
    }
    console.log(cartData)
    return (
        <div className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50'>
            <div className='bg-white w-full max-w-xl p-6 rounded-xl shadow-lg
      relative overflow-y-auto max-h-[90vh] mx-4'>
                <button onClick={() => { navigate("/") }}
                    className='absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl'>
                    <FaTimes />
                </button>

                <h2 className='text-2xl font-bold text-green-500 text-center mb-4'>Your Cart</h2>
                {
                    cartData.map((value, index) => (
                        <ul key={index} className='divide-y divide-gray-300 '>
                            <li className='flex items-center gap-5 py-4'>
                                <img src={`/uploads/${value.ProductImage}`} alt="ProductImage" className='w-16 h-16 object-cover rounded border' />
                                <div className='flex-1'>
                                    <h3 className='font-semibold text-gray-700'>{value.ProductName}</h3>
                                    <p className='text-sm text-gray-500'>₹{value.ProductPrice} each</p>
                                    <div className='flex items-center mt-2 gap-2'>
                                        <button onClick={()=>{dispatch(DecrementQuantity(value))}} className='px-2 py-1 bg-green-200 rounded hover:bg-green-400'><FaMinus  /></button>
                                        <span className='px-2'>{value.quantity}</span>
                                        <button onClick={()=>{dispatch(IncrementQuantity(value))}} className='px-2 py-1 bg-green-200 rounded hover:bg-green-400'><FaPlus /></button>
                                    </div>
                                </div>
                                <p className='font-bold text-green-500'>₹{value.quantity * value.ProductPrice}</p>
                                <MdDelete
                                onClick={() => { dispatch(deleteCartItem(value)) }}
                                 className='
                                 text-gray-500 hover:text-red-500 text-xl hover:cursor-pointer'/>
                            </li>
                        </ul>
                    ))
                }

                {/* total */}
                <div className='mt-6 text-right '>
                    <p className='text-lg font-semibold text-gray-800'>Total:-
                        <span className='text-green-500'> ₹{cartAllValue.totalPrice}</span></p>
                    <button onClick={handlePayment} className=' mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 transition'>Checkout</button>
                </div>
            </div>
        </div>
    )
}

export default Cart
