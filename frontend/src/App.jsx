import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import Presentation from './components/pages/Presentation';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme';
import Preview from './components/pages/Preview';

function App () {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='register' element={<Register/>} />
          <Route path='login' element={<Login/>} />
          <Route path='dashboard' element={<Dashboard/>} />
          <Route path='/' element={<Login/>} />
          <Route path='presentation/:pptName' element={<Presentation/>} />
          <Route path="/:pptName/preview" element={<Preview/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
