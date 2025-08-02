import React,{useState} from 'react'
import Slidebar from './Slidebar'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AddProducts = () => {
    const navigate=useNavigate();
    const [product,setProduct] =useState({Pname:"",Price:"",Cat:""})
    const [pimage,setPimage] = useState("")

    async function handleForm(e){
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("Pname",product.Pname)
        formdata.append("Price",product.Price)
        formdata.append("Cat",product.Cat)
        formdata.append("image",pimage)
        console.log(formdata)
        try {
            const response = await fetch("/api/addadminproduct",{
                method:"POST",
                body:formdata,
            })
            const result= await response.json()
            if(response.ok){
                toast.success(result.message);
                navigate("/admin/products")
            }else{
                toast.error(result.message)
            }
        } catch (error) {
            toast.error(error)
        }
    }

    function handleChange(e) {
    setProduct({ ...product, [e.target.name]: e.target.value })
    }
    function handleImage(e) {
    setPimage(e.target.files[0])
    }

    return (
        <div className='flex mt-16'>
            <Slidebar />
            <div className='flex-1 p-10 bg-gray-50 min-h-screen'>
                <h1 className='text-3xl font-bold mb-6 text-gray-800'>Add Products 💹</h1>
                <button className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300'
                onClick={()=>{
                    navigate("/admin/products")
                }}
                >Back</button>
                <form onSubmit={handleForm} enctype="multipart/form-data" action="" className='bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto space-y-6 mt-5'>
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Product Name</label>
                    <input required type="text" value={product.Pname} onChange={handleChange} name='Pname'
                    placeholder='e.g Fresh Fruits'
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'/>

                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Price ₹</label>
                    <input required type="number" value={product.Price} onChange={handleChange} name='Price'
                    placeholder='e.g 999' 
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'/>
                    
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Categorys</label>
                    <select required value={product.Cat} onChange={handleChange} name="Cat" id="" className='w-full px-4 py-2 rounded border  border-gray-300  focus:outline-none focus:ring-2 focus:ring-purple-500 '>
                        <option value="">----Select----</option>
                        <option value="cafe">Cafe</option>
                        <option value="home">Home</option>
                        <option value="toys">Toys</option>
                        <option value="fresh">Fresh</option>
                        <option value="electronics">Electronics</option>
                        <option value="mobile">Mobile</option>
                        <option value="beauty">Beauty</option>
                    </select>
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Product Image</label>
                    <input onChange={handleImage} type="file" name="pimage" id="" className='w-full px-4 py-2 rounded border  border-gray-300  focus:outline-none focus:ring-2 focus:ring-purple-500 '/>
                    <div className='text-right'>
                        <button type='sumit' className='bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700'>
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProducts
