import React, { useState } from "react";
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
// import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import CommentIcon from "@mui/icons-material/Comment";
import { Link, Route, Routes } from "react-router-dom";
import ManageNews from "./ManageNews";
import UserProfile from "./UserProfile";
// import CreateNewsPage from "./CreateNewsPage";
// import UserProfile from "./UserProfile";
// import ManageNews from "./ManageNews";
// import ManageCategories from "./CategoryManagement";
// import ManageCommentsPage from "./ManageCommentsPage";
// import AdminRoute from '../components/AdminRoute';

const drawerWidth = 240;

const AdminDashboard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
      // onClick={() => setDrawerOpen(false)}
    >
      <div className="text-2xl flex justify-around items-center font-bold bg-black py-4">
        <Link to="/" className="text-white">
          Shot News
        </Link>
        <button className="text-white ml-10" onClick={handleDrawerToggle}>
          <CloseIcon />
        </button>
      </div>
      <List>
        {/* <ListItem component={Link} to="/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="User Profile" />
        </ListItem> */}

        <ListItem component={Link} to="/create-news">
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Create News" />
        </ListItem>
        <Divider/>
        <ListItem component={Link} to="/manage-news">
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Manage News " />
        </ListItem>
        <Divider/>
        <ListItem component={Link} to="/manage-category">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Category " />
        </ListItem>
        <Divider/>
        <ListItem component={Link} to="/manage-comments">
          <ListItemIcon>
            <CommentIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Comments " />
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <div className="flex bg-gray-100">
      <CssBaseline />

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          marginLeft: drawerOpen ? drawerWidth : 0,
          transition: "margin 0.3s",
          width:"100%"
        }}
      >
        <Toolbar />
        {/* <button onClick={handleDrawerToggle} className="text-2xl font-bold px-2 py-4  text-white bg-black rounded absolute left-1 ">
          {">"}
        </button> */}
        <button
          onClick={handleDrawerToggle}
          className="text-2xl font-bold px-2 py-4 text-white bg-black rounded fixed left-0 top-20 md:left-1 md:top-auto  md:absolute"
        >
          {">"}
        </button>
        <UserProfile/>
      </main>
    </div>
  );
};

export default AdminDashboard;
