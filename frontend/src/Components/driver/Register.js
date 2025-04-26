import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('DRIVER');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!username || !password || !role) {
            setErrorMessage('Please fill out all fields.');
            return;
        }

        const userData = { username, password, role };

        try {
            await axios.post('http://localhost:8070/user/register', userData);
            alert('Registration successful');
            setUsername('');
            setPassword('');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="DRIVER">Driver</option>
                        <option value="ADMIN">Admin</option>
                        <option value="CUSTOMER">Customer</option>
                    </select>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="btn-register">Register</button>
            </form>
        </div>
    );
} 