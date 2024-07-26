import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
}

interface CommentsProps {
  newsId: string;
}

const Comments: React.FC<CommentsProps> = ({ newsId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>(`/api/news/${newsId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  const addComment = async () => {
    try {
      const response = await axios.post<Comment>(`/api/news/${newsId}/comments`, { text: comment });
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="mb-4">
        <textarea 
          className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" 
          rows={4} 
          value={comment} 
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)} 
          placeholder="Add a comment..."
        />
        <button 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" 
          onClick={addComment}
        >
          Add Comment
        </button>
      </div>
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment._id} className="bg-white shadow-md rounded-md p-4">
            <p className="text-gray-800">{comment.text}</p>
            <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
