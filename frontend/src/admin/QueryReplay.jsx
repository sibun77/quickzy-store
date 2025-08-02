import React, { useEffect, useState } from 'react'
import Slidebar from './Slidebar'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const QueryReplay = () => {
    const navigate=useNavigate()
    const { id } = useParams();
    const [query, setQuery] = useState({ to: "", sub: "", body: "" })
    async function queryData() {
        try {
            const response = await fetch(`/api/querysingledata/${id}`)
            const record = await response.json();
            if (response.ok) {
                console.log(record)
                setQuery({ to: record.data.Email })
            } else {
                console.log(record.message)
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { queryData() }, [id])
    function handleChange(e) {
        setQuery({ ...query, [e.target.name]: e.target.value })
    }
    async function handleForm(e) {
        e.preventDefault()
        console.log(query)
        try {
            const response = await fetch(`/api/mailreplay/${id}`, {
                method: "POST",
                headers: { "Content-Type":"application/json" },
                body: JSON.stringify(query),
            })
            const record=await response.json()
            if(response.ok){
                toast.success(record.message)
                //navigate(`admin/admin-query/${id}`)
            }else{
                toast.error(record.message)
            }
        } catch (error) {
            toast.error(error)
        }
    }
    return (
        <div className='flex mt-16'>
            <Slidebar />
            <div className='flex-1 p-10 bg-gray-50 min-h-screen'>
                <h1 className='text-3xl font-bold mb-6 text-gray-800'>Replay Query</h1>
                <form action="" onSubmit={handleForm} className='bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto space-y-6 mt-5'>
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>To</label>
                    <input type="text"
                        value={query.to}
                        name='to'
                        placeholder='Mail-to'
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500' />
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>From</label>
                    <input type="text"
                        name='ProductName'
                        value={"quickzy@gmail.com"}
                        placeholder='Mail-From'
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500' />
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Sub</label>
                    <input type="text"
                        name='sub'
                        value={query.sub}
                        onChange={handleChange}
                        placeholder='sub...'
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500' />
                    <label htmlFor="" className='block text-gray-700 font-medium mb-1'>Body</label>
                    <textarea name="body" id=""
                        value={query.body}
                        onChange={handleChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'>

                    </textarea>
                    <div className='text-right'>
                        <button className='bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700'>
                            Replay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default QueryReplay
