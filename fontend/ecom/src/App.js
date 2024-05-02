import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.scss';
import Login from './components/Login';
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './components/Home';
import DetailProduct from './components/DetailProduct';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path="/product/:id" element={<DetailProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;