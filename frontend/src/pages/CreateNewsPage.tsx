import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css"; // Import styles for react-quill
import ReactQuill from "react-quill";
import Loader from '../components/Loader';

interface Category {
  _id: string;
  name: string;
}

interface News {
  _id?: string;
  title: string;
  description: string;
  images: string[];
  date: string;
  time: string;
  tags: string[];
  category: string;
  visibility: string;
}

const CreateNews: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Replace with your actual API base URL
  const location = useLocation();
  const navigate = useNavigate();
  const newsToEdit = location.state as News | null;

  useEffect(() => {
    fetchCategories();
    if (newsToEdit) {
      setTitle(newsToEdit.title);
      setDescription(newsToEdit.description);
      setDate(newsToEdit.date);
      setTime(newsToEdit.time);
      setTags(() => [...newsToEdit.tags]);
      setCategory(newsToEdit.category);
      setVisibility(newsToEdit.visibility as "public" | "private");
      setIsEdit(true);
      console.log(newsToEdit.tags);
    }

    console.log("newsToEdit", newsToEdit);
  }, [newsToEdit]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      toast.error("Error fetching categories");
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prevImages) => prevImages.concat(filesArray));
    }
  };

  const removeImage = (image: File) => {
    setImages(images.filter((img) => img !== image));
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      images.forEach((image) => formData.append("images", image));
      formData.append("date", date);
      formData.append("time", time);
      formData.append("tags", tags.join(",")); // Send tags as a comma-separated string
      formData.append("category", category);
      formData.append("visibility", visibility);

      if (newsToEdit) {
        await axios.put(
          `${API_BASE_URL}/api/news/${newsToEdit._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("News updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/api/news/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("News created successfully");
      }

      setTitle("");
      setDescription("");
      setImages([]);
      setDate(new Date().toISOString().slice(0, 10));
      setTime(new Date().toLocaleTimeString());
      setTags([]);
      setCategory("");
      setVisibility("public");
      navigate("/admin/manage-news");
    } catch (error) {
      console.error("Error creating or updating news", error);
      toast.error("Error creating or updating news");
    } finally {
      setLoading(false); // Set loading state to false after request completes
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <h1 className="text-3xl font-bold mb-4">
        {newsToEdit ? "Edit News" : "Create News"}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader loading={loading} />
        </div>
      ) : (
        <form
          className="bg-white p-6 rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              className="bg-white"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="images"
            >
              Images
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                isEdit ? "bg-gray-300" : ""
              }`}
              type="file"
              multiple
              onChange={handleImageUpload}
              disabled={isEdit}
            />
            <div className="mt-2 flex flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="relative m-1">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`upload-${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    onClick={() => removeImage(image)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                isEdit ? "bg-gray-300" : ""
              }`}
              type="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              required
              disabled={isEdit}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="time"
            >
              Time
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                isEdit ? "bg-gray-300" : ""
              }`}
              type="time"
              value={time}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTime(e.target.value)
              }
              required
              disabled={isEdit}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tags"
            >
              Tags
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Add tags and press Enter"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
            />
            <div className="mt-2 flex flex-wrap">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-red-600"
                    onClick={() => removeTag(tag)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setCategory(e.target.value)
              }
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="visibility"
            >
              Visibility
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={visibility}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setVisibility(e.target.value as "public" | "private")
              }
              required
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {newsToEdit ? "Update News" : "Create News"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateNews;
