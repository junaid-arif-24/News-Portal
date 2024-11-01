import { Request, Response } from 'express';
import Comment from '../models/Comment';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  userId?: string;
}

// Get all comments
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'name')
      .populate('news', 'title');
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching comments', error });
  }
};

// Add a comment to a news article
export const addComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const comment = new Comment({
      text,
      user: req.userId,
      news: new mongoose.Types.ObjectId(id),
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment', error });
  }
};

// Get comments for a specific news article
// export const getCommentsForNews = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const comments = await Comment.find({ news: new mongoose.Types.ObjectId(id) })
//       .populate('user', 'name email');
//     res.status(200).json(comments);
//   } catch (error) {
//     res.status(400).json({ message: 'Error fetching comments', error });
//   }
// };

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting comment', error });
  }
};
