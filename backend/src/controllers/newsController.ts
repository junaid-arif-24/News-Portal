import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import News from '../models/News';
import User from '../models/User';
import Category from '../models/Category';
import mongoose from 'mongoose';

// Helper interface for Authenticated Requests
interface AuthRequest extends Request {
    userId?: string;
}

// Create news
export const createNews = async (req: Request, res: Response) => {
    const { title, description, category, tags, visibility, youtubeUrl } = req.body;
    const files = req.files as Express.Multer.File[];
    if (!files) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    try {
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file.path, {
                folder: 'news_images',
                format: 'jpeg',
            })
        );
        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map(result => result.secure_url);

        const currentDate = new Date();
        const date = currentDate.toISOString().slice(0, 10);
        const time = currentDate.toLocaleTimeString();

        const newNews = new News({
            title,
            description,
            images: imageUrls,
            date,
            time,
            category,
            tags: tags.split(','),
            visibility,
            youtubeUrl
        });
        await newNews.save();
        res.status(201).json(newNews);
    } catch (error) {
        console.error('Error creating news', error);
        res.status(400).json({ message: 'Error creating news', error });
    }
};

// Get trending news
export const getTrendingNews = async (req: Request, res: Response) => {
    try {
        const trendingNews = await News.find({ visibility: 'public' })
            .populate('category', 'name')
            .sort()
            .limit(5);
        res.status(200).json(trendingNews);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching trending news', error });
    }
};

// Get the latest news
export const getLatestNews = async (req: Request, res: Response) => {
    try {
        const latestNews = await News.find().sort({ date: -1 }).limit(10);
        res.status(200).json(latestNews);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching latest news', error });
    }
};

// Get all news with advanced filters
export const getAllNews = async (req: Request, res: Response) => {
    const { title, description, date, tags, category, visibility } = req.query;
    const query: any = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (description) query.description = { $regex: description, $options: 'i' };
    if (date) query.date = new Date(date as string);
    if (typeof tags === 'string' && tags !== '') query.tags = { $in: tags.split(',') };
    if (category) {
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
            query.category = categoryDoc._id;
        } else {
            return res.status(400).json({ message: 'Category not found' });
        }
    }
    if (typeof visibility === 'string') {
        if (visibility !== 'all') {
            query.visibility = visibility; // Use the provided visibility if it's not 'all'
        }
    }

    try {
        const news = await News.find(query).populate('category', 'name');
        res.status(200).json(news);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching news', error });
    }
};

// Get news by ID
export const getNewsById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const news = await News.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
            .populate('category', 'name')
            .exec();
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching news', error });
    }
};

// Update news
export const updateNews = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, category, tags, visibility, youtubeUrl, removedImages } = req.body;
    const files = req.files as Express.Multer.File[];

    try {
        const newsToUpdate = await News.findById(id);
        if (!newsToUpdate) {
            return res.status(404).json({ message: 'News not found' });
        }

        // Handle image removal
        if (removedImages && removedImages.length > 0) {
            let removedImagesArray = Array.isArray(removedImages) ? removedImages : JSON.parse(removedImages);

            for (const imageUrl of removedImagesArray) {
                const regex = /\/news_images\/([^\/]+)\.[a-zA-Z]+$/;
                const match = imageUrl.match(regex);
                if (match && match[1]) {
                    const publicId = match[1];
                    await cloudinary.uploader.destroy(`news_images/${publicId}`);
                }
            }

            newsToUpdate.images = newsToUpdate.images.filter(img => !removedImagesArray.includes(img));
        }

        // Handle new image uploads
        if (files && files.length > 0) {
            const uploadPromises = files.map(file =>
                cloudinary.uploader.upload(file.path, { folder: 'news_images', format: 'jpeg' })
            );
            const uploadResults = await Promise.all(uploadPromises);
            const imageUrls = uploadResults.map(result => result.secure_url);

            newsToUpdate.images = [...newsToUpdate.images, ...imageUrls];
        }

        // Update the news fields
        newsToUpdate.title = title || newsToUpdate.title;
        newsToUpdate.description = description || newsToUpdate.description;
        newsToUpdate.category = category || newsToUpdate.category;
        newsToUpdate.tags = tags ? tags.split(',') : null;
        newsToUpdate.visibility = visibility || newsToUpdate.visibility;
        newsToUpdate.youtubeUrl = youtubeUrl || newsToUpdate.youtubeUrl;

        const updatedNews = await newsToUpdate.save();
        res.status(200).json(updatedNews);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(400).json({ message: 'Error updating news', error });
    }
};

// Delete news
export const deleteNews = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await News.findByIdAndDelete(id);
        res.status(200).json({ message: 'News deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting news', error });
    }
};

// Get relatable news based on category and tags
export const getRelatableNews = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const currentNews = await News.findById(id).populate('category');
        if (!currentNews) {
            return res.status(404).json({ message: 'News not found' });
        }

        const relatableNews = await News.find({
            _id: { $ne: id },
            category: currentNews.category,
            tags: { $in: currentNews.tags },
        }).limit(4);

        res.status(200).json(relatableNews);
    } catch (error) {
        console.error('Error fetching relatable news', error);
        res.status(500).json({ message: 'Error fetching relatable news', error });
    }
};

// Save news
export const saveNews = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newsId = new mongoose.Types.ObjectId(id);
        if (!user.savedNews.includes(newsId)) {
            user.savedNews.push(newsId);
            await user.save();
        }

        res.status(200).json({ message: 'News saved' , savedNews: user.savedNews});
    } catch (error) {
        res.status(400).json({ message: 'Error saving news', error });
    }
};

export const getSavedNews = async (req: AuthRequest, res: Response) => {
    if (!req.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const savedNews = user.savedNews
        res.status(200).json(savedNews);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching saved news', error });
    }
}

// Unsave news
export const unsaveNews = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const user = await User.findById(req.userId);
        const newsId = new mongoose.Types.ObjectId(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.savedNews.includes(newsId)) {
            user.savedNews = user.savedNews.filter(savedNewsId => !savedNewsId.equals(newsId));
            await user.save();
        }

        res.status(200).json({ message: 'News unsaved' , savedNews: user.savedNews});
    } catch (error) {
        res.status(400).json({ message: 'Error unsaving news', error });
    }
};
