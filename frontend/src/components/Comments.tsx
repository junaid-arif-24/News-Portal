import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface Comment {
  _id: string;
  text: string;
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
    <div>
      <h2>Comments</h2>
      <textarea 
        value={comment} 
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)} 
      />
      <button onClick={addComment}>Add Comment</button>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
