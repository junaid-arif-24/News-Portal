import React, { useState } from 'react';
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
 
} from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import { Link, Route, Routes } from 'react-router-dom';
import CreateNewsPage from './CreateNewsPage';
import UserProfile from './UserProfile';
import ManageNews from './ManageNews';
import ManageCategories from './CategoryManagement';
import ManageCommentsPage from './ManageCommentsPage';
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
        <Link to="/" className='text-white'>Shot News</Link>
        <button className="text-white ml-10" onClick={handleDrawerToggle}><CloseIcon /></button>
      </div>
      <List>
        <ListItem component={Link} to="/admin/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="User Profile" />
        </ListItem>
        <ListItem component={Link} to="/admin/create-news">
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Create News" />
        </ListItem>
        <ListItem component={Link} to="/admin/manage-news">
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Manage News " />
        </ListItem>
        <ListItem component={Link} to="/admin/manage-category">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Category " />
        </ListItem>
        <ListItem component={Link} to="/admin/manage-comments">
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
    <div className='flex'>
      <CssBaseline />
     
      <Drawer
        variant="temporary"
        open={true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
          marginLeft: drawerOpen ? drawerWidth : 0,
          transition: 'margin 0.3s',
          
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="profile" element={<UserProfile />} />
          <Route path="create-news" element={<CreateNewsPage />} />
          <Route path="manage-news" element={<ManageNews />} />
          <Route
            path="manage-category"
            element={<ManageCategories />}
          />
          <Route path="manage-comments" element={<ManageCommentsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
