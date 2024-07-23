import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  description: string;
}

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const createCategory = async () => {
    try {
      const response = await axios.post('/api/categories', { name, description });
      setCategories([...categories, response.data]);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating category', error);
    }
  };

  const updateCategory = async (id: string, updatedName: string, updatedDescription: string) => {
    try {
      const response = await axios.put(`/api/categories/${id}`, { name: updatedName, description: updatedDescription });
      setCategories(categories.map(cat => cat._id === id ? response.data : cat));
    } catch (error) {
      console.error('Error updating category', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error) {
      console.error('Error deleting category', error);
    }
  };

  return (
    <div>
      <h1>Manage Categories</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
      ></textarea>
      <button onClick={createCategory}>Create Category</button>
      <ul>
        {categories.map(category => (
          <li key={category._id}>
            <input
              type="text"
              value={category.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateCategory(category._id, e.target.value, category.description)}
            />
            <textarea
              value={category.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateCategory(category._id, category.name, e.target.value)}
            ></textarea>
            <button onClick={() => deleteCategory(category._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;
