import React, { useState, useEffect } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editUserId, setEditUserId] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        fetch('http://localhost:5000/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));
    };

    const handleUserSubmit = (e) => {
        e.preventDefault();
        const updatedUserData = { username: editUsername, password: editPassword };

        if (editUserId) {
            // Update existing user
            fetch(`http://localhost:5000/api/users/${editUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUserData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update user');
                    }
                    return loadUsers();  // Reload users after successful update
                })
                .then(() => resetForm())
                .catch(err => console.error(err));
        } else {
            // Add new user
            fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUserData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to add user');
                    }
                    return loadUsers();  // Reload users after successful add
                })
                .then(() => resetForm())
                .catch(err => console.error(err));
        }
    };

    const editUser = (username) => {
        const user = users.find(u => u.username === username);
        if (user) {
            setEditUsername(user.username);
            setEditPassword(user.password);
            setEditUserId(user.username); // Use username as user ID for simplicity
        }
    };

    const deleteUser = (username) => {
        fetch(`http://localhost:5000/api/users/${username}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                loadUsers(); // Reloading the user list after deletion
            })
            .catch(err => console.error(err));
    };

    const resetForm = () => {
        setEditUsername('');
        setEditPassword('');
        setEditUserId('');
    };

    return (
        <div>
            <h2>User Management</h2>
            <h3>Registered Users</h3>
            <table id="userTable">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => editUser(user.username)}>Edit</button>
                                <button onClick={() => deleteUser(user.username)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>{editUserId ? 'Edit User' : 'Add a New User'}</h3>
            <form onSubmit={handleUserSubmit}>
                <input type="hidden" value={editUserId} />
                <label>Username:</label>
                <input 
                    type="text" 
                    value={editUsername} 
                    required 
                    onChange={e => setEditUsername(e.target.value)} 
                />
                <label>Password:</label>
                <input 
                    type="password" 
                    value={editPassword} 
                    required 
                    onChange={e => setEditPassword(e.target.value)} 
                />
                <button type="submit">{editUserId ? 'Update User' : 'Add User'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>
        </div>
    );
};

export default UserManagement;