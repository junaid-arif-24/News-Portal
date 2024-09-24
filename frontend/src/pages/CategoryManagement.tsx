import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

interface Category {
  _id: string;
  name: string;
}

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false); // New state for form visibility
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
        toast.error("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const createCategory = async () => {
    try {
      if (!name ) {
        toast.error("Please fill in all fields");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/categories/create`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories([...categories, response.data]);
      setName("");
      setShowForm(false); // Hide the form after adding
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category", error);
      toast.error("Error creating category");
    }
  };

  const updateCategory = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/api/categories/update/${id}`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(
        categories.map((cat) => (cat._id === id ? response.data : cat))
      );
      setName("");
      setEditingCategoryId(null);
      setShowForm(false); // Hide the form after updating
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category", error);
      toast.error("Error updating category");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/categories/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category", error);
      toast.error("Error deleting category");
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategoryId(category._id);
    setName(category.name);
    setShowForm(true); // Show the form when editing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategoryId) {
      updateCategory(editingCategoryId);
    } else {
      createCategory();
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 w-full">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      {!showForm && (
        <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => {
            setEditingCategoryId(null);
            setName("");
            setShowForm(true); // Show the form
          }}
        >
          + Add Category
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 border bg-white shadow-md rounded"
        >
          <div className="mb-2">
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {editingCategoryId ? "Update Category" : "Add Category"}
          </button>
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => {
              setEditingCategoryId(null);
              setName("");
              setShowForm(false); // Hide the form
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <div className="bg-white shadow-xl rounded p-4">
        <h2 className="text-lg font-semibold mb-4">All Categories</h2>
        {loading ? (
             <div className="flex justify-center items-center ">
             <Loader loading={loading} />
           </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-5xl py-10">No categories</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li
                key={category._id}
                className="mb-2 p-2 border-b flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{category.name || "No Name"}</p>
                </div>

                <div>
                  <button
                    className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded"
                    onClick={() => handleEditClick(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => deleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
