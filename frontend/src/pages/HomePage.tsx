import React, { useEffect, useState } from "react";
import NewsList from "../components/NewsList";
import LatestNews from "../components/LatestNews";
import axios from "axios";
import TrendingNews from "../components/TrendingNews";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { News } from "../types/DataProvider";
import { toast } from "react-toastify";

const HomePage: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const fetchFilteredNews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/news`, {
        params: {
          visibility: "public" ,
        },
      });
      setNewsList(response.data);
    } catch (error) {
      toast.error("Error fetching news");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredNews();
  }, []);

  // Extract the titles of the last 5 news items
  const lastFiveNewsTitles = newsList.slice(0, 5).map((news) => news.title);

  return (
    <div className="m-0 p-0">
      <Marquee
        gradient={false}
        speed={50}
        direction="left"
        style={{
          backgroundColor: "#9DBDFF", 
          color: "black", 
          padding: "10px",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {lastFiveNewsTitles.map((title, index) => (
          <span key={index} style={{ marginRight: "40px" }}>
            &bull; {title}
          </span>
        ))}
      </Marquee>

      <LatestNews />
      <TrendingNews />

      <NewsList newsList={newsList} isLoading={isLoading} />
      <p
        onClick={() => {
          navigate("/all-news");
        }}
        className="text-blue-500 underline text-xl cursor-pointer text-right mx-5"
      >{`see all ->`}</p>
    </div>
  );
};

export default HomePage;
