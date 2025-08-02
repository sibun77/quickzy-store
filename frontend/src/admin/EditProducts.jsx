import React, { useEffect, useState } from 'react'
import Slidebar from './Slidebar'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const EditProducts = () => {
    const navigate=useNavigate();
    const [edit,setEdit]=useState({})
    const {id} =useParams()
    async function editValueData(){
        try {
            const response = await fetch(`/api/editvaluedata/${id}`)
            const record=await response.json();
            console.log(record)
            setEdit(record.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        editValueData();
    },[])
    function handleChange(e) {
    setEdit({ ...edit, [e.target.name]: e.target.value })
    }
    async function handleForm(e){
        e.preventDefault();
        console.log(edit);
        try {
            const formData = {
                Pname:edit.ProductName,
                Price:edit.ProductPrice,
                Cat:edit.ProductCategory,
                Pstatus:edit.ProductStatus,
            };
            const response =await fetch(`/api/productupdate/${id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(formData)
            })
            const record=await response.json();
            if(response.ok){
                toast.success(record.message)
                navigate("/admin/products")
            }else{
                toast.error(record.message)
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className='flex mt-16'>
            <Slidebar />
            <div className='flex-1 p-10 bg-gray-50 min-h-screen'>
                <h1 className='text-3xl font-bold mb-6 text-gray-800'>Edit Products 🤪</h1>
                <button className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300'
                onClick={()=>{
                    navigate("/admin/products")
                }}
                >Back</button>
                <form action="" onSubmit={handleForm} className='bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto space-y-6 mt-5'>
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Product Name</label>
                    <input type="text"
                    onChange={handleChange}
                    value={edit.ProductName}
                    name='ProductName'
                    placeholder='e.g Fresh Fruits'
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'/>

                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Price ₹</label>
                    <input type="number"
                    onChange={handleChange}
                    value={edit.ProductPrice}
                    name='ProductPrice'
                    placeholder='e.g 999'
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'/>
                    
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Categorys</label>
                    <select name="ProductCategory" id="" 
                    onChange={handleChange}
                    value={edit.ProductCategory}
                    className='w-full px-4 py-2 rounded border  border-gray-300  focus:outline-none focus:ring-2 focus:ring-purple-500 '>
                        <option value="">----Select----</option>
                        <option value="cafe">Cafe</option>
                        <option value="home">Home</option>
                        <option value="toys">Toys</option>
                        <option value="fresh">Fresh</option>
                        <option value="electronics">Electronics</option>
                        <option value="mobile">Mobile</option>
                        <option value="beauty">Beauty</option>
                    </select>
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Action</label>
                    <select name="ProductStatus" onChange={handleChange} id="" className='w-full px-4 py-2 rounded border  border-gray-300  focus:outline-none focus:ring-2 focus:ring-purple-500 '>
                        <option value="">----Select----</option>
                        <option value="In-Stock">In-Stock</option>
                        <option value="Out-Of-Stock">Out-Of-Stock</option>
                    </select>
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Product Image</label>
                    <input type="file" name="" id="" className='w-full px-4 py-2 rounded border  border-gray-300  focus:outline-none focus:ring-2 focus:ring-purple-500 '/>
                    <div className='text-right'>
                        <button className='bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700'>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProducts
