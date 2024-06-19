import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss';
import Login from './components/Login';
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './components/Home/Home';
import DetailProduct from './components/DetailProduct/DetailProduct';
import Order from './components/Order/Order';
import Admin from './components/Admin/Admin';
import HistoryOrders from './components/HistoryOrders/HistoryOrders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path='/cart' element={<Order />}></Route>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/getHistoryOrders" element={<HistoryOrders/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;