import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useMediaQuery from '@mui/material/useMediaQuery';
import Loader from '../components/Loader';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUserId, setEditUserId] = useState<string | null>(null); // To track which user is being edited
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  // Use the useMediaQuery hook to check if the screen is small
  const isSmallScreen = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true); 
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId: string) => {
    try {
      setIsLoading(userId);
      await axios.patch(`${API_BASE_URL}/api/user/block/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      fetchUsers(); 
      toast.success('User blocked successfully');
    } catch (error) {
      console.error('Error blocking user', error);
      toast.error('Error blocking user');
    } finally {
      setIsLoading(null);
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      setIsLoading(userId);
      await axios.patch(`${API_BASE_URL}/api/user/unblock/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      fetchUsers(); 
      toast.success('User unblocked successfully');
    } catch (error) {
      console.error('Error unblocking user', error);
      toast.error('Error unblocking user');
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      setIsDeleting(userId);
      await axios.delete(`${API_BASE_URL}/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      fetchUsers(); 
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user', error);
      toast.error('Error deleting user');
    } finally {
      setIsDeleting(null);
    }
  };

  // Edit logic: Set the edit mode for a particular user
  const handleEdit = (user: User) => {
    setEditUserId(user._id);
    setEditedUser(user); // Set the current user values into editable state
  };

  // Save edited user
  const handleSaveEdit = async (userId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/api/user/update/${userId}`, editedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      setEditUserId(null); // Exit edit mode
      fetchUsers(); // Refresh users after update
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user', error);
      toast.error('Error updating user');
    }
  };

  // Cancel the edit
  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditedUser({});
  };

  // Update the fields when editing
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader loading={true} size={60} />
        </div>
      ) : isSmallScreen ? (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user._id} className="bg-white p-4 rounded shadow-md">
              {editUserId === user._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name || ''}
                    onChange={handleFieldChange}
                    className="block w-full p-2 mb-2 border rounded"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email || ''}
                    onChange={handleFieldChange}
                    className="block w-full p-2 mb-2 border rounded"
                  />
                  <select
                    name="role"
                    value={editedUser.role || ''}
                    onChange={handleFieldChange}
                    className="block w-full p-2 mb-2 border rounded"
                  >
                    <option value="subscriber">Subscriber</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleSaveEdit(user._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {user.name || 'No name available'}</p>
                  <p><strong>Email:</strong> {user.email || 'No email available'}</p>
                  <p><strong>Role:</strong> {user.role || 'No role available'}</p>
                  <p><strong>Status:</strong> {user.isBlocked ? 'Blocked' : 'Active'}</p>
                  <div className="flex justify-between mt-4">
                    {user.isBlocked ? (
                      <button
                        onClick={() => handleUnblock(user._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        {isLoading === user._id && <Loader loading={true} size={20} />} Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(user._id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                      >
                        {isLoading === user._id && <Loader loading={true} size={20} />} Block
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      {isDeleting === user._id && <Loader loading={true} size={20} />} Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b">
                <td className="py-2 px-4">
                  {editUserId === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedUser.name || ''}
                      onChange={handleFieldChange}
                      className="p-2 border rounded"
                    />
                  ) : (
                    user.name || 'No name available'
                  )}
                </td>
                <td className="py-2 px-4">
                  {editUserId === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email || ''}
                      onChange={handleFieldChange}
                      className="p-2 border rounded"
                    />
                  ) : (
                    user.email || 'No email available'
                  )}
                </td>
                <td className="py-2 px-4">
                  {editUserId === user._id ? (
                    <select
                      name="role"
                      value={editedUser.role || ''}
                      onChange={handleFieldChange}
                      className="p-2 border rounded"
                    >
                      <option value="subscriber">Subscriber</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role || 'No role available'
                  )}
                </td>
                <td className="py-2 px-4">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                <td className="py-2 px-4 space-x-2">
                  {editUserId === user._id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(user._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {user.isBlocked ? (
                        <button
                          onClick={() => handleUnblock(user._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          {isLoading === user._id && <Loader loading={true} size={20} />} Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(user._id)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                          {isLoading === user._id && <Loader loading={true} size={20} />} Block
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        {isDeleting === user._id && <Loader loading={true} size={20} />} Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllUsers;
