import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Forbidden from "../components/Forbidden"
import AdminNavbar from '../components/AdminNavbar';

function UserManagement() {
  const isAdminLogIn = localStorage.getItem('userType') === 'admin';

  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [navbarOpen, setNavbarOpen] = useState(false);

  const navigate = useNavigate()

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

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
    <>
      {isAdminLogIn ? (
          // if admin is logged in is true
          <div className="flex flex-row">
            <div className={`${navbarOpen  ? 'w-1/4' : 'w-20'} transition-all duration-500 overflow-hidden`}>
              <AdminNavbar navbarOpen={navbarOpen} toggleNavbar={toggleNavbar} isDashboard={false}/>
            </div>
            <div className={`${navbarOpen  ? 'w-3/4' : 'w-11/12'} h-screen transition-all duration-500 p-12 text-left`}>
              <div className={`w-full mx-auto`}>
                <h1 className="text-3xl text-green border-b-2 font-semibold border-green pb-5 text-left">User Management</h1>
                
              </div>
              <div className="my-5">
              <p>Total Users: {userCount}</p> 
              </div>
              <div className="h-[83%] overflow-y-auto border-2 rounded-lg">
                <div className="">
                <div className="overflow-x-auto bg-white">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          First Name
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Middle Name
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Last Name
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => {
                        return (
                          <tr key={user._id}>
                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                              {user._id}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                              {user.fname}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                              {user.mname}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                              {user.lname}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                              {user.email}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
              
            </div>
          </div>
      ) : (
          //if they are not logged in
          <>
          <Forbidden />
          </>
      )}
      </>
  );

}

export default UserManagement
