import React, { useState, useEffect } from "react";
import axios from "axios";
import { calculateReadingTime, formatDate, formatTime } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { LatestNewsSkeleton } from "./Skeletons"; // Import the custom skeleton
import { Category, News } from "../types";



const LatestNews: React.FC = () => {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestNews();
    fetchCategories();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const response = await axios.get<News[]>(`${API_BASE_URL}/api/news/latest`);
      setLatestNews(response.data);
    } catch (error) {
      console.error("Error fetching latest news", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  if (isLoading) {
    return <LatestNewsSkeleton />;
  }

  if (latestNews.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-4xl font-semibold text-gray-700">No news available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-5 py-2 mb-5">
      <h1 className="text-lg font-bold mb-1 underline">Latest News</h1>
      <div className="mx-auto">
        <div className="md:flex md:max-h-[calc(100vh-30px)]">
          {/* Main Featured News Slider */}
          <div className="md:w-2/3 p-4">
            <Carousel
              animation="slide"
              interval={5000}
              duration={300}
              navButtonsAlwaysVisible
              navButtonsProps={{
                style: {
                  top: "50%", // Position the buttons vertically in the middle
                  transform: "translateY(-250%)",
                },
              }}
            >
              {latestNews.slice(0, 8).map((news) => (
                <Paper
                  key={news._id}
                  onClick={() => navigate(`/news/${news._id}`)}
                  className="bg-white md:h-max-[calc(100vh-30px)] p-0 rounded-lg shadow-md cursor-pointer"
                >
                  {news.images?.length > 0 && (
                    <img
                      src={news.images[0] || "/default-image.jpg"} // Provide a default image if none exists
                      alt={news.title || "News Image"} // Provide a default alt text
                      className="w-full h-96 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">
                        &bull; {formatDate(news.date || "")} at {formatTime(news.time || "")}
                        <span className="text-gray-600"> &bull; {calculateReadingTime(news.description || "")} min read </span>
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{news.title || "No Title"}</h2>
                    <div className="text-gray-700">
                      {parse(news.description?.substring(0, 100) || "No description available...")}
                    </div>
                  </div>
                </Paper>
              ))}
            </Carousel>
          </div>

          {/* Side Section for Categories */}
          <div className="w-full md:w-1/3 p-4 space-y-4 max-h-full md:h-[calc(100vh-50px)] overflow-y-auto">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => navigate(`/category/${category.name}`)}
                className="bg-[#DDEEFF] rounded-lg cursor-pointer shadow-md flex h-14 items-center transition-transform transform hover:scale-105"
              >
                <div className="p-4 flex flex-col justify-between w-full">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold mb-1">{category.name || category.name}</h2>
                    
                    </div>
                    <p className="text-black font-bold w-10 h-10 rounded-full flex justify-center items-center bg-blue-400">
                      {
                        category.newsCount || category.newsCount
                      }
                    </p>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
