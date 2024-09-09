import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { icons } from "../utils/icons";
import { formatDate, formatTime } from "../utils/helper"; // Adjust the import according to your project structure
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
interface Subscription {
  _id: string;
  name: string;
}

interface SavedNews {
  _id: string;
  title: string;
  date: string;
  time: string;
  images: string[];
  category: {
    name: string;
  };
}

interface UserProf {
  email: string;
  name: string;
  role: string;
  subscriptions: Subscription[];
  savedNews: SavedNews[];
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProf | null>(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { isAuthenticated , user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  const handleUnsubscribe = async (categoryId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to unsubscribe");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/categories/unsubscribe`,
        { categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile((prevProfile) => {
        if (prevProfile) {
          const updatedSubscriptions = prevProfile.subscriptions.filter(
            (sub) => sub._id !== categoryId
          );
          return { ...prevProfile, subscriptions: updatedSubscriptions };
        }
        return prevProfile;
      });
      toast.success("Unsubscribed successfully");
    } catch (error) {
      console.error("Error unsubscribing", error);
    }
  };

  if (!profile) return <Loader loading={!profile} />;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Name</h3>
                  <p className="text-gray-700">{profile.name}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12h.01M12 16h.01M8 12h.01M12 8h.01M12 20v-4M8 8v8m8-8v8"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Email</h3>
                  <p className="text-gray-700">{profile.email}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <svg
                    className="h-6 w-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11V9m0 4h.01M4 4h16M4 20h16M12 15h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Role</h3>
                  <p className="text-gray-700">{profile.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {user?.role === "subscriber" && (<>
          <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">Subscriptions</h2>
          {profile.subscriptions.length === 0 ? (
            <div className="flex justify-center items-center h-24">
              <p className="text-gray-700 text-3xl">No subscriptions found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.subscriptions.map((sub) => (
                <div
                  key={sub._id}
                  onClick={() =>
                    navigate(`/all-news`, { state: { category: sub.name } })
                  }
                  className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer justify-between"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      {icons[sub.name]
                        ? icons[sub.name]({ size: "h-6 w-6" })
                        : icons["Default"]({ size: " h-6 w-6" })}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{sub.name}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnsubscribe(sub._id)}
                    className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded"
                  >
                    Unsubscribe
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Saved News:</h2>
          {profile.savedNews.length === 0 ? (
            <div className="flex justify-center items-center h-24">
              <p className="  text-gray-700 ">No saved news found.</p>
            </div>
          ) : (
            <div className="flex flex-wrap -mx-2">
              {profile.savedNews.map((news) => (
                <div
                  key={news._id}
                  className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4 cursor-pointer"
                  onClick={() => navigate(`/news/${news._id}`)}
                >
                  <div className="rounded-lg shadow-md bg-gray-100 overflow-hidden">
                    <img
                      src={news.images[0]}
                      alt={news.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-blue-500 hover:underline text-lg font-semibold">
                        {news.title}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {formatDate(news.date)} at {formatTime(news.time)}
                      </p>
                      <p className="text-gray-700 mt-2">
                        Category: {news.category.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
          
        )}
    
      
      </div>
    </div>
  );
};

export default UserProfile;
