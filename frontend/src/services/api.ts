import axios from "axios";
import { Category, User } from "../types";

// Base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Adjust the base URL as needed

// Define the common axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(`/auth/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    setAuthToken(response.data.token);
    return response.data;
  } catch (error: any) {
    console.log(error, "Error API.ts");
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Your account is blocked"
    ) {
      // toast.error('Your account is blocked');
      throw new Error("Your account is blocked");
    } else {
      throw new Error("Login failed");
    }
  }
};

// Register function
export const register = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  try {
    const response = await apiClient.post(`/auth/register`, {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw new Error("Registration failed");
  }
};

// function api call for forgot password
export const forgotPassword = async (email: string) => {
  try {
    const response = await apiClient.post(`/auth/forgot-password`, { email });
    localStorage.setItem('reset-token', response.data.resetToken);
  } catch (error) {
    throw new Error("Forgot password failed");
  }
};

// reset password api call 
export const resetPassword = async (password: string) => {
  try {
    const response = await apiClient.post(`/auth/reset-password`, { password } ,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('reset-token')}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Reset password failed");
  }
};

// Function to set the authorization token
export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Fetch news by ID


// Get current usER
export const getUser = async () => {
  try {
    const token = localStorage.getItem("token"); // Get the token from local storage
    if (!token) {
      throw new Error("No token found");
    }

    const response = await apiClient.get(`/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Fetching user failed");
  }
};
// Logout function
export const logout = async () => {
  try {
    await apiClient.post(`/auth/logout`);
    localStorage.removeItem("token");
    setAuthToken("");
  } catch (error) {
    throw new Error("Logout failed");
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
    const response = await apiClient.get("/api/news", {
      params: { ...filters },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news", error);
    throw error;
  }
};

// Fetch all users
export const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.get("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

// Block a user
export const blockUser = async (userId: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    await apiClient.patch(
      `/api/user/block/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error("Error blocking user", error);
    throw error;
  }
};

// Unblock a user
export const unblockUser = async (userId: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    await apiClient.patch(
      `/api/user/unblock/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error("Error unblocking user", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    await apiClient.delete(`/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};

// Update user
export const updateUser = async (
  userId: string,
  updatedUser: Partial<User>
) => {
  try {
    const token = localStorage.getItem("token") || "";
    await apiClient.put(`/api/user/update/${userId}`, updatedUser, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.get("/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories", error);
    throw error;
  }
};

// Create a category
export const createCategory = async (name: string): Promise<Category> => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.post(
      "/api/categories/create",
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category", error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (
  id: string,
  name: string
): Promise<Category> => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.put(
      `/api/categories/update/${id}`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token") || "";
    await apiClient.delete(`/api/categories/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting category", error);
    throw error;
  }
};

// Fetch subscribed categories
export const fetchSubscribedCategories = async () => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.get(
      "/api/categories/subscribed-categories",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subscribed categories", error);
    throw error;
  }
};

// Subscribe to a category
export const subscribeCategory = async (categoryId: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.post(
      "/api/categories/subscribe",
      { categoryId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error subscribing to category", error);
    throw error;
  }
};

// Unsubscribe from a category
export const unsubscribeCategory = async (categoryId: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.post(
      "/api/categories/unsubscribe",
      { categoryId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error unsubscribing from category", error);
    throw error;
  }
};

// Create or update news
export const createOrUpdateNews = async (
  formData: FormData,
  isEdit: boolean,
  newsId?: string
) => {
  const endpoint = isEdit ? `/api/news/${newsId}` : "/api/news/create";
  const method = isEdit ? "put" : "post";

  const response = await apiClient({
    url: endpoint,
    method: method,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  return response.data;
};

// fetch related news
export const fetchRelatedNews = async (newsId: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.get(
      `/api/news/relatable/${newsId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching related news", error);
    throw error;
  }
};

// fetch trending news
export const fetchTrendingNews = async () => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.get("/api/news/trending", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error fetching trending news", error);
    throw error;
  }
};

// fetch News by Id
export const fetchNewsById = async (id: string) => {
  try {
    const response = await apiClient.get(`/api/news/${id}`);
    return response;
  } catch (error) {
    throw new Error("Fetching news failed");
  }
};

// saved news 
export const fetchSavedNews = async () => {
  try {
    const token = localStorage.getItem("token") || "";
    const response = await apiClient.get("/api/news/savedNews", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching saved news", error);
    throw error;
  }
}

