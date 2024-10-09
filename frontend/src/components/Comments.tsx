import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { formatDate } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Comment, CommentsProps } from '../types';
import { createComment, fetchAllCommentsByNewsId } from '../services/api';


const Comments: React.FC<CommentsProps> = ({ newsId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await fetchAllCommentsByNewsId(newsId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  const addComment = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await createComment(comment, newsId);
      fetchComments();
      setComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.length === 0 ? (
        <div className="text-center text-gray-600 mb-4 font-bold text-xl">No Comments Yet</div>
      ) : (
        <ul className="space-y-4 mb-4">
          {comments.map((comment) => (
            <li key={comment._id} className="bg-white shadow-md rounded-md p-4">
              <div className="flex items-center mb-2">
                <FaUserCircle className="text-2xl text-gray-500 mr-2" />
                <span className="text-gray-700 font-semibold">{comment.user?.name || 'Anonymous'}</span>
              </div>
              <p className="text-gray-800 mb-1">{comment.text || 'No comment text available'}</p>
              <span className="text-sm text-gray-500">&bull; {formatDate(comment.date || '')}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={comment}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={addComment}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default Comments;
