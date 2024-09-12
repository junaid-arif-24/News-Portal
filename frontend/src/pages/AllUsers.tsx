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
  const [isLoading, setIsLoading] = useState<string | null>(null); // Tracks user ID for block/unblock
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Tracks overall data loading state
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  // Use the useMediaQuery hook to check if the screen is small
  const isSmallScreen = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true when starting data fetch
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
      setLoading(false); // Set loading to false when data fetch is complete
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
      fetchUsers(); // Refresh the user list
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
      fetchUsers(); // Refresh the user list
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
      fetchUsers(); // Refresh the user list
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user', error);
      toast.error('Error deleting user');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {/* Show loader while data is loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader loading={true} size={60} />
        </div>
      ) : isSmallScreen ? (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user._id} className="bg-white p-4 rounded shadow-md">
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
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  {isDeleting === user._id && <Loader loading={true} size={20} />} Delete
                </button>
              </div>
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
                <td className="py-2 px-4">{user.name || 'No name available'}</td>
                <td className="py-2 px-4">{user.email || 'No email available'}</td>
                <td className="py-2 px-4">{user.role || 'No role available'}</td>
                <td className="py-2 px-4">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                <td className="py-2 px-4 flex space-x-2">
                  {user.isBlocked ? (
                    <button
                      onClick={() => handleUnblock(user._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded flex gap-1"
                    >
                      {isLoading === user._id && <Loader loading={true} size={20} />} Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(user._id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded flex gap-1"
                    >
                      {isLoading === user._id && <Loader loading={true} size={20} />} Block
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded flex gap-1"
                  >
                    {isDeleting === user._id && <Loader loading={true} size={20} />} Delete
                  </button>
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
