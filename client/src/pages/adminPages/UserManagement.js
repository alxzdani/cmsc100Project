import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function UserManagement() {
  const isAdminLogIn = localStorage.getItem('userType') === 'admin';

  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  const navigate = useNavigate()

  const handleLogout = () => {
      localStorage.removeItem('token')
      navigate('/login')
  }

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
        <div>
            {isAdminLogIn ? (
                // if admin is logged in is true
                <>
                    <li><button onClick={handleLogout}> Log Out</button></li>
                    <div>

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
                </>
            ) : (
                // if they are not logged in false
                <>
                    <Link to='/login'><li>Log in</li></Link>
                    <Link to='/signup'><li>Sign up</li></Link>

                    <p>forbidden page</p>
                </>
            )}
        </div>
    </div>
  );
}

export default UserManagement
