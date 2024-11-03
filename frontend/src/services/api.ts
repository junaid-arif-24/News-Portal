import axios from "axios";
import { Category, User, Comment, News, SavedNewsId } from "../types/DataProvider";

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
export const getUser = async ():Promise<User> => {
  const response = await apiClient.get(`/auth/user`);
  return response.data as User;
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
}): Promise<News[]> => {
  const response = await apiClient.get("/api/news", {
    params: { ...filters },
  });
  return response.data as News[];
};

// Fetch all users
export const fetchAllUsers = async ():Promise<User[]> => {
  const response = await apiClient.get("/api/user/all");
  return response.data as User[];
};

// Block a user
// export const toggleBlockUser = async (userId: string, isBlocked: boolean) => {
//   await apiClient.patch(`/api/user/toggle-block/${userId}`, { isBlocked });
// };



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
  return response.data as Category[];
};

// Create a category
export const createCategory = async (name: string): Promise<Category> => {
  const response = await apiClient.post("/api/categories/create", { name });
  return response.data as Category;
};

// Update a category
export const updateCategory = async (
  id: string,
  name: string
): Promise<Category> => {
  const response = await apiClient.put(`/api/categories/update/${id}`, {
    name,
  });
  return response.data as Category;
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/categories/delete/${id}`);
};

// Fetch subscribed categories
export const fetchSubscribedCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/api/categories/subscribed-categories");
  return response.data as Category[];
};

// Subscribe to a category
export const subscribeCategory = async (categoryId: string): Promise<Category> => {
  const response = await apiClient.post("/api/categories/subscribe", {
    categoryId,
  });
  return response.data as Category;
};

// Unsubscribe from a category
export const unsubscribeCategory = async (categoryId: string): Promise<Category> => {
  const response = await apiClient.post("/api/categories/unsubscribe", {
    categoryId,
  });
  return response.data as Category;
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
export const fetchRelatedNews = async (newsId: string): Promise<News[]> => {
  const response = await apiClient.get(`/api/news/relatable/${newsId}`);
  return response.data as News[];
};

// Fetch latest news
export const fetchLatestNews = async (): Promise<News[]> => {
  const response = await apiClient.get("/api/news/latest");
  return response.data as News[];
};

// Fetch trending news
export const fetchTrendingNews = async (): Promise<News[]> => {
  const response = await apiClient.get("/api/news/trending");
  return response.data as News[];
};

// Fetch news by ID
export const fetchNewsById = async (id: string): Promise<News> => {
  const response = await apiClient.get(`/api/news/${id}`);
  return response.data as News;
};

export const deleteNews = async (id: string) => {
  await apiClient.delete(`/api/news/${id}`);
};

export const saveNewsbyId = async (id: string) => {
  await apiClient.post(`/api/news/${id}/save`);
};

export const unsaveNewsbyId = async (id: string) => {
  await apiClient.post(`/api/news/${id}/unsave`);
};
// Fetch saved news
export const fetchSavedNews = async ():Promise<SavedNewsId[]> => {
  const response = await apiClient.get("/api/news/savedNews");
  return response.data as SavedNewsId[];
};


// Add a comment
export const createComment = async (newsId: string, comment: string): Promise<Comment> => {
  const response = await apiClient.post(`/api/comments/${newsId}/comments`, { text: comment });
  return response.data;
};

// Fetch comments for a news article
// export const fetchAllCommentsByNewsId = async (newsId: string): Promise<Comment[]> => {
//   const response = await apiClient.get(`/api/comments/${newsId}/comments`);
//   return response.data as Comment[];
// };

// Delete a comment
export const deleteComment = async ( commentId: string) => {
  await apiClient.delete(`/api/comments/${commentId}`);
};


// Apis for Comments

export const fetchAllComments = async (): Promise<Comment[]> => {
    const response = await apiClient.get("/api/comments/all");
    return response.data as Comment[];
 
};

