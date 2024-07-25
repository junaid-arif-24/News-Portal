import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

// Register function
export const register = async (name: string, email: string, password: string , role: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role });
    return response.data;
  } catch (error) {
    throw new Error('Registration failed');
  }
};

// Function to set the authorization token
export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Fetch news by ID
export const fetchNewsById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Fetching news failed');
  }
};

// Get current user
export const getUser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user`);
    return response.data;
  } catch (error) {
    throw new Error('Fetching user failed');
  }
};

// Logout function
export const logout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`);
    localStorage.removeItem('token');
    setAuthToken('');
  } catch (error) {
    throw new Error('Logout failed');
  }
};
