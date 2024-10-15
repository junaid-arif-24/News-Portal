import axios from "axios";
import { Category, User, Comment } from "../types/DataProvider";

// Base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Define the common axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically set the authorization token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login function
export const login = async (email: string, password: string) => {
  const response = await apiClient.post(`/auth/login`, { email, password });
  localStorage.setItem("token", response.data.token);
  setAuthToken(response.data.token);
  return response.data;
};

// Register function
export const register = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const response = await apiClient.post(`/auth/register`, {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

// Forgot password function
export const forgotPassword = async (email: string) => {
  const response = await apiClient.post(`/auth/forgot-password`, { email });
  localStorage.setItem("reset-token", response.data.resetToken);
  return response.data;
};

// Reset password function
export const resetPassword = async (password: string) => {
  const resetToken = localStorage.getItem("reset-token");
  const response = await apiClient.post(
    `/auth/reset-password`,
    { password },
    {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    }
  );
  return response.data;
};

// Function to set the authorization token
export const setAuthToken = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// Fetch user by ID
export const getUser = async () => {
  const response = await apiClient.get(`/auth/user`);
  return response.data;
};

// Logout function
export const logout = async () => {
  await apiClient.post(`/auth/logout`);
  localStorage.removeItem("token");
  setAuthToken("");
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
  const response = await apiClient.get("/api/news", {
    params: { ...filters },
  });
  return response.data;
};

// Fetch all users
export const fetchAllUsers = async () => {
  const response = await apiClient.get("/api/user/all");
  return response.data;
};

// Block a user
export const blockUser = async (userId: string) => {
  await apiClient.patch(`/api/user/block/${userId}`);
};

// Unblock a user
export const unblockUser = async (userId: string) => {
  await apiClient.patch(`/api/user/unblock/${userId}`);
};

// Delete a user
export const deleteUser = async (userId: string) => {
  await apiClient.delete(`/api/user/${userId}`);
};

// Update user
export const updateUser = async (
  userId: string,
  updatedUser: Partial<User>
) => {
  await apiClient.put(`/api/user/update/${userId}`, updatedUser);
};

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/api/categories");
  return response.data;
};

// Create a category
export const createCategory = async (name: string): Promise<Category> => {
  const response = await apiClient.post("/api/categories/create", { name });
  return response.data;
};

// Update a category
export const updateCategory = async (
  id: string,
  name: string
): Promise<Category> => {
  const response = await apiClient.put(`/api/categories/update/${id}`, {
    name,
  });
  return response.data;
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/categories/delete/${id}`);
};

// Fetch subscribed categories
export const fetchSubscribedCategories = async () => {
  const response = await apiClient.get("/api/categories/subscribed-categories");
  return response.data;
};

// Subscribe to a category
export const subscribeCategory = async (categoryId: string) => {
  const response = await apiClient.post("/api/categories/subscribe", {
    categoryId,
  });
  return response.data;
};

// Unsubscribe from a category
export const unsubscribeCategory = async (categoryId: string) => {
  const response = await apiClient.post("/api/categories/unsubscribe", {
    categoryId,
  });
  return response.data;
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
    },
  });

  return response.data;
};

// Fetch related news
export const fetchRelatedNews = async (newsId: string) => {
  const response = await apiClient.get(`/api/news/relatable/${newsId}`);
  return response.data;
};

// Fetch latest news
export const fetchLatestNews = async () => {
  const response = await apiClient.get("/api/news/latest");
  return response.data;
};

// Fetch trending news
export const fetchTrendingNews = async () => {
  const response = await apiClient.get("/api/news/trending");
  return response.data;
};

// Fetch news by ID
export const fetchNewsById = async (id: string) => {
  const response = await apiClient.get(`/api/news/${id}`);
  return response.data;
};

// Fetch saved news
export const fetchSavedNews = async () => {
  const response = await apiClient.get("/api/news/savedNews");
  return response.data;
};

// Add a comment
export const createComment = async (newsId: string, comment: string): Promise<Comment> => {
  const response = await apiClient.post(`/api/news/${newsId}/comments`, { text: comment });
  return response.data;
};

// Fetch comments for a news article
export const fetchAllCommentsByNewsId = async (newsId: string): Promise<Comment[]> => {
  const response = await apiClient.get(`/api/news/${newsId}/comments`);
  return response.data;
};

// Delete a comment
export const deleteComment = async ( commentId: string) => {
  await apiClient.delete(`/api/comments/${commentId}`);
};


// Apis for Comments

export const fetchAllComments = async () => {
    const response = await apiClient.get("/api/comments/all");
    return response;
 
};

// export const createComment = async (comment :string,newsId : string) => {
//   try {
//     const token = localStorage.getItem("token") || "";
//     const response = await apiClient.post(`/api/comments/${newsId}/comments`, { text: comment }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response;
//   } catch (error) {
//     console.error("Error creating comment", error);
//     throw error;
//   }
// };

// export const deleteComment = async (id: string) => {
//   try {
//     const token = localStorage.getItem("token") || "";
//     await apiClient.delete(`/api/comments/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   } catch (error) {
//     console.error("Error deleting comment", error);
//     throw error;
//   }
// };

// export const fetchAllCommentsByNewsId = async (newsId: string) => {
//   try {
//     const token = localStorage.getItem("token") || "";
//     const response = await apiClient.get(`/api/comments/${newsId}/comments`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response;
//   } catch (error) {
//     console.error("Error fetching comments", error);
//     throw error;
//   }
// }

