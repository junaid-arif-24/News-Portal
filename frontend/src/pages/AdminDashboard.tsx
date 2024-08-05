import React, { useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  Toolbar,
  Divider,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ManageNews from "./ManageNews";
import UserProfile from "./UserProfile";
import CreateNews from "./CreateNewsPage";
import ManageCommentsPage from "./ManageCommentsPage";
import ManageCategories from "./CategoryManagement";
import NotFound from "./NotFound";

const drawerWidth = 240;

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
useEffect(() => {
  navigate('/admin/profile');
}, []);
  const getLinkClass = (path: string) => {
    return location.pathname === path ? "bg-gray-200" : "";
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ width: drawerWidth }} role="presentation">
          <div className="text-2xl flex justify-around items-center font-bold bg-black py-4">
            <Link to="/" className="text-white">
              Shot News
            </Link>
          </div>
          <List>
            <ListItem
              component={Link}
              to="/admin/profile"
              className={getLinkClass("/admin/profile")}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="User Profile" />
            </ListItem>
            <Divider />
            <ListItem
              component={Link}
              to="/admin/create-news"
              className={getLinkClass("/admin/create-news")}
            >
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary="Create News" />
            </ListItem>
            <Divider />
            <ListItem
              component={Link}
              to="/admin/manage-news"
              className={getLinkClass("/admin/manage-news")}
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Manage News" />
            </ListItem>
            <Divider />
            <ListItem
              component={Link}
              to="/admin/manage-category"
              className={getLinkClass("/admin/manage-category")}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Category" />
            </ListItem>
            <Divider />
            <ListItem
              component={Link}
              to="/admin/manage-comments"
              className={getLinkClass("/admin/manage-comments")}
            >
              <ListItemIcon>
                <CommentIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Comments" />
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>

      <main className="w-full">
        {/* <Toolbar /> */}
        {/* <div className="container mx-auto p-4 bg-white shadow-md rounded-lg w-full"> */}
        <Routes>
          <Route path="profile" element={<UserProfile />} />
          <Route path="create-news" element={<CreateNews />} />
          <Route path="manage-news" element={<ManageNews />} />
          <Route path="manage-category" element={<ManageCategories />} />
          <Route path="manage-comments" element={<ManageCommentsPage />} />
          {/* <Route path="/" element={<Navigate to="/admin/profile" />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
