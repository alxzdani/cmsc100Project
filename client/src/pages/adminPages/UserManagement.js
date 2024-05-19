import React, { useState, useEffect } from 'react'
import axios from 'axios'

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);


  //fetch users from the server
  const fetchUsers = () => {
    axios
      .get('http://localhost:3001/user-management')
      .then((res) => {
        setUsers(res.data.users);
        setUserCount(res.data.total);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };


  return (
    <div>
      User Management

      {/* display total users */}
      <p>Total Users: {userCount}</p> 

      {/* show all users in the db except admin */}
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.fname}</td>
              <td>{user.mname}</td>
              <td>{user.lname}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  )
}

export default UserManagement
