import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/helper';
import Loader from '../components/Loader';
import { Comment } from '../types/DataProvider';
import { deleteComment, fetchAllComments } from '../services/api';


const ManageCommentsPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ''; // Adjust the base URL as needed

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true); // Start loading
      try {
        const responseData = await fetchAllComments();
        setComments(responseData);
      } catch (error) {
        console.error('Error fetching comments', error);
        toast.error('Error fetching comments'); // Show error toast
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchComments();
  }, [API_BASE_URL]);

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id);
      setComments(comments.filter(comment => comment._id !== id));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment', error);
      toast.error('Error deleting comment');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Comments</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader loading={true} size={40} />
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border text-left text-gray-500">User</th>
                  <th className="px-4 py-2 border text-left text-gray-500">News Title</th>
                  <th className="px-4 py-2 border text-left text-gray-500">Comment</th>
                  <th className="px-4 py-2 border text-left text-gray-500">Date</th>
                  <th className="px-4 py-2 border text-left text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comments.length > 0 ? comments.map(comment => (
                  <tr key={comment._id}>
                    <td className="px-4 py-2 border">{comment.user?.name || 'N/A'}</td>
                    <td className="px-4 py-2 border">{comment.news.title || 'N/A'}</td>
                    <td className="px-4 py-2 border">{comment.text}</td>
                    <td className="px-4 py-2 border">{formatDate(comment.date)}</td>
                    <td className="px-4 py-2 border">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(comment._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 border text-center text-gray-500">No comments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden">
            {comments.length > 0 ? comments.map(comment => (
              <div key={comment._id} className="bg-white shadow rounded-lg mb-4 p-4">
                <h2 className="text-xl font-bold">{comment.user?.name || 'N/A'}</h2>
                <p className="text-gray-700"><strong>News Title:</strong> {comment.news.title || 'N/A'}</p>
                <p className="text-gray-700"><strong>Comment:</strong> {comment.text}</p>
                <p className="text-gray-500"><strong>Date:</strong> {formatDate(comment.date)}</p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
                  onClick={() => handleDelete(comment._id)}
                >
                  Delete
                </button>
              </div>
            )) : (
              <div className="bg-white shadow rounded-lg p-4 text-center text-gray-500">
                No comments found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCommentsPage;
