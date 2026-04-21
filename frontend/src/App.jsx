import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import Presentation from './components/pages/Presentation';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/theme';
import Preview from './components/pages/Preview';
import { StoreProvider } from './context/StoreContext';

function App () {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <StoreProvider>
          <Routes>
            <Route path='register' element={<Register/>} />
            <Route path='login' element={<Login/>} />
            <Route path='dashboard' element={<Dashboard/>} />
            <Route path='/' element={<Login/>} />
            <Route path='presentation/:presentationId' element={<Presentation/>} />
            <Route path="/presentation/:presentationId/preview" element={<Preview/>} />
          </Routes>
        </StoreProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
