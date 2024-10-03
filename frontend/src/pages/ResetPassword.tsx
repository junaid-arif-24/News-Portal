import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('reset-token');
  const navigate = useNavigate();
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {

      if (!token) {
        setError('Invalid token');
        return;
      }

      const response = await resetPassword(password);

      if (response.status === 200) {
        navigate('/login');
      } else {
        setError('Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
