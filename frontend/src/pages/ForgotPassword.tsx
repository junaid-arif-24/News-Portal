import React, { useState } from 'react';
import axios from 'axios';
import { forgotPassword } from '../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword(email);
      setMessage('Check your email for a password reset link');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Forgot Password</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button type="submit" className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Submit
        </button>
        {message && <p className="text-center mt-4 text-green-600">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
