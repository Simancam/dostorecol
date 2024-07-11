// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './views/Home';
import Detail from './views/Detail';
import Login from './views/Login';
import Admin from './views/Admin';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<Detail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;