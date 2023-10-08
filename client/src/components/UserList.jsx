import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch user data from your backend API (replace with your actual API endpoint)
        fetch('/api/users')
            .then((response) => response.json())
            .then((data) => {
                // Update the state with the retrieved user data
                setUsers(data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    return (
        <div>
            <h2>User List</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Roles</TableCell>
                        <TableCell>Registration Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.roles.join(', ')}</TableCell>
                            <TableCell>{user.registrationDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UserList;
