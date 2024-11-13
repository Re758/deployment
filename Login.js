import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file for styles

function Login({ onLogin, isLoggedIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(u => u.username === username && u.password === password);

        if (currentUser) {
            onLogin(); // Inform the parent component of successful login
            setStatus(""); // Clear status on successful login
            setUsername(""); // Clear username input
            setPassword(""); // Clear password input
            navigate('/dashboard'); // Redirect to dashboard
        } else {
            setStatus("Invalid username or password!");
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.username === username);

        if (existingUser) {
            setStatus("User already exists! Please log in.");
        } else {
            // Register the new user
            const newUser = { username, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Immediately hide the form after registration
            setStatus("Registration successful! You can now log in with your credentials.");
            setUsername(""); // Clear username input
            setPassword(""); // Clear password input

            // Set a timeout to navigate to login after showing the message
            setTimeout(() => {
                setIsRegistering(false); // Switch to login mode
                setStatus(""); // Clear the status
                navigate('/'); // Redirect to login page
            }, 2000); // Adjust the time as necessary
        }
    };

    // Return null if already logged in
    if (isLoggedIn) {
        return null;  // Optionally, redirect to dashboard directly here
    }

    return (
        <div className="login-container">
            <h1>WELCOME TO WALTER CAFE!! FEEL AT HOME</h1>
            <h2>{isRegistering ? "Register" : "Log In"}</h2>
            {status && <p className="status-message">{status}</p>}
            {!isLoggedIn && (
                <form className="login-form" onSubmit={isRegistering ? handleRegister : handleLogin}>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        className="login-input" 
                        placeholder="Username" 
                        required 
                        value={username}
                        onChange={e => setUsername(e.target.value)} 
                    />
                    <label>Password:</label>
                    <input 
                        type="password" 
                        className="login-input" 
                        placeholder="Password" 
                        required 
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                    />
                    <button type="submit" className="login-button">{isRegistering ? "Register" : "Login"}</button>
                </form>
            )}
            <button className="toggle-button" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Log In" : "Register"}
            </button>
        </div>
    );
}

export default Login;