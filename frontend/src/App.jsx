import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import AdminDashboard from './admin/AdminDashboard'
import AdminProducts from './admin/AdminProducts'
import AddProducts from './admin/AddProducts'
import EditProducts from './admin/EditProducts'
import Contact from './pages/Contact'
import AdminQuery from './admin/AdminQuery'
import QueryReplay from './admin/QueryReplay'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/reg' element={<Register/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/contact' element={<Contact/>}/>

        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/products' element={<AdminProducts/>}/>
        <Route path='/admin/add-products' element={<AddProducts/>}/>
        <Route path='/admin/edit-products/:id' element={<EditProducts/>}/>
        <Route path='/admin/admin-query' element={<AdminQuery/>}/>
        <Route path='/admin/query-replay/:id' element={<QueryReplay/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App
