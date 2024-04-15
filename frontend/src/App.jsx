import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import Presentation from './components/pages/Presentation';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='register' element={<Register/>} />
        <Route path='login' element={<Login/>} />
        <Route path='dashboard' element={<Dashboard/>} />
        <Route path='/' element={<Login/>} />
        <Route path='presentation/:pptName' element={<Presentation/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
