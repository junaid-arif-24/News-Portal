import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css"; // Import styles for react-quill
import ReactQuill from "react-quill";
import Loader from '../components/Loader';
import { Category , News} from "../types";



const CreateNews: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Added state for existing images
  const [removedImages, setRemovedImages] = useState<string[]>([]); 
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [errorFields, setErrorFields] = useState<{
    title: boolean;
    description: boolean;
    images: boolean;
    category: boolean;
  }>({
    title: false,
    description: false,
    images: false,
    category: false,
  });

  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const quillRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const newsToEdit = location.state as News | null;

  useEffect(() => {
    fetchCategories();
    if (newsToEdit) {
      setTitle(newsToEdit.title);
      setDescription(newsToEdit.description);
      setTags(() => [...newsToEdit.tags]);
      setCategory(newsToEdit.category._id);
      setVisibility(newsToEdit.visibility as "public" | "private");
      setYoutubeUrl(newsToEdit.youtubeUrl );
      setExistingImages(newsToEdit.images);
      setIsEdit(true);
      console.log(newsToEdit);
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

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter((img) => img !== imageUrl));
    setRemovedImages((prev) => [...prev, imageUrl]); // Add to removed list
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

  const validateForm = () => {
    // Define individual error flags
    const hasTitleError = !title;
    const hasDescriptionError = !description;
    const hasImagesError = images.length === 0 && existingImages.length === 0;
    const hasCategoryError = !category;
  
    // Set errors based on priority
    if (hasTitleError) {
      setErrorFields({
        title: true,
        description: false,
        images: false,
        category: false,
      });
      titleRef.current?.focus();
      toast.error("Please enter a title");
      return false;
    } else if (hasDescriptionError) {
      setErrorFields({
        title: false,
        description: true,
        images: false,
        category: false,
      });
      quillRef.current?.focus();
      toast.error("Please enter a description");
      return false;
    } else if (hasImagesError) {
      setErrorFields({
        title: false,
        description: false,
        images: true,
        category: false,
      });
      imageInputRef.current?.focus();
      toast.error("Please upload at least one image");
      return false;
    } else if (hasCategoryError) {
      setErrorFields({
        title: false,
        description: false,
        images: false,
        category: true,
      });
      categoryRef.current?.focus();
      toast.error("Please select a category");
      return false;
    }
  
    // No errors
    setErrorFields({
      title: false,
      description: false,
      images: false,
      category: false,
    });
    return true;
  };
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      images.forEach((image) => formData.append("images", image));
      formData.append("removedImages", JSON.stringify(removedImages));
      formData.append("tags", tags.join(",")); // Send tags as a comma-separated string
      formData.append("category", category);
      formData.append("visibility", visibility);
      formData.append("youtubeUrl", youtubeUrl);

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
      setTags([]);
      setCategory("");
      setVisibility("public");
      setYoutubeUrl("");
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
              ref={titleRef}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errorFields.title ? "border-red-500" : ""
              }`}
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
                setErrorFields((prev) => ({ ...prev, title: false }));
              }}
            
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <div
              ref={quillRef}
              className={`${
                errorFields.description ? "bg-red-200" : ""
              }`}
            >
              <ReactQuill
                theme="snow"
                value={description}
                onChange={(value) => {
                  setDescription(value);
                  setErrorFields((prev) => ({ ...prev, description: false }));
                }}
                className={`${errorFields.description} ? "" : "bg-white"`}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="images"
            >
              Images
            </label>
            <div>
          {/* {existingImages.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`news-img-${index}`} />
              <button type="button" onClick={() => handleRemoveExistingImage(img)}>Remove</button>
            </div>
          ))} */}
        </div>
            <input
              ref={imageInputRef}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errorFields.images ? "border-red-500" : ""
              }`}
              type="file"
              multiple
              onChange={handleImageUpload}
              
            />
            <div className="mt-2 flex flex-wrap">
            {existingImages.map((image, index) => (
                <div key={index} className="relative m-1">
                  <img
                    src={image}
                    alt={`upload-${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    onClick={() => handleRemoveExistingImage(image)}
                  >
                    &times;
                  </button>
                </div>
              ))}
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
              htmlFor="title"
            >
              YouTube URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Youtube video url"
              value={youtubeUrl === "undefined" ? "" : youtubeUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setYoutubeUrl(e.target.value)
              }
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              ref={categoryRef}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errorFields.category ? "border-red-500" : ""
              }`}
              value={category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setCategory(e.target.value);
                setErrorFields((prev) => ({ ...prev, category: false }));
              }}
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
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {newsToEdit ? "Update News" : "Create News"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateNews;
