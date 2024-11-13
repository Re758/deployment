import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import ManageProducts from './ManageProducts';
import UserManagement from './UserManagement';
import Login from './Login';
import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Handler functions
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const PrivateRoute = ({ component: Component }) => (
        isLoggedIn ? <Component /> : <Navigate to="/" />
    );

    return (
        <Router>
            <div>
                {/* Show header and navigation only if logged in */}
                {isLoggedIn && (
                    <header>
                        <h1><b>WALTER CAFE INVENTORY DASHBOARD</b></h1>
                        <nav>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/manageProducts">Manage Products</Link>
                            <Link to="/userManagement">User Management</Link>
                            <Link to="/" onClick={handleLogout} className="nav-button">Logout</Link>
                        </nav>
                    </header>
                )}

                <main>
                    <Routes>
                        {/* Default route to show the Login page */}
                        <Route path="/" element={<Login onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
                        <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
                        <Route path="/manageProducts" element={<PrivateRoute component={ManageProducts} />} />
                        <Route path="/userManagement" element={<PrivateRoute component={UserManagement} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;