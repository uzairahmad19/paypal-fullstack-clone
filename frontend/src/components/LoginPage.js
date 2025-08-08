import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login for:', email);
            const response = await api.post('/users/login', { email, password });
            console.log('Login API response:', response.data);
            localStorage.setItem('token', response.data.token);
            console.log('Token set in localStorage:', response.data.token);
            navigate('/dashboard');
            console.log('Navigating to /dashboard');
        } catch (error) {
            console.error('Login failed', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
            <div className="card p-4" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <p className="text-center mt-3">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
