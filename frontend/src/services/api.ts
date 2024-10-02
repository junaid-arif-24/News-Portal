import axios from 'axios';

// Base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Adjust the base URL as needed


// Define the common axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(`/auth/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
    return response.data;
  } catch (error: any) {
    console.log(error, 'Error API.ts');
    if (error.response && error.response.data && error.response.data.message === 'Your account is blocked') {
      // toast.error('Your account is blocked');
      throw new Error('Your account is blocked');
    }
    else{
    throw new Error('Login failed');

    }
  }
};

// Register function
export const register = async (name: string, email: string, password: string , role: string) => {
  try {
    const response = await apiClient.post(`/auth/register`, { name, email, password, role });
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
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Fetching news failed');
  }
};

// Get current usER
export const getUser = async () => {
  try {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiClient.get(`/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the Authorization header
      }
    });

    return response.data;
  } catch (error) {
    throw new Error('Fetching user failed');
  }
};
// Logout function
export const logout = async () => {
  try {
    await apiClient.post(`/auth/logout`);
    localStorage.removeItem('token');
    setAuthToken('');
  } catch (error) {
    throw new Error('Logout failed');
  }
};



// Fetch news with optional filters
export const fetchNews = async (filters: {
  title?: string;
  description?: string;
  date?: string;
  tags?: string;
  category?: string;
  visibility?: string;
}) => {
  try {
    const response = await apiClient.get('/api/news', {
      params: { ...filters },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news', error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories', error);
    throw error;
  }
};