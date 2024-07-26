import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category'
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const AdminDashboard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true); // Set Drawer to be open by default

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

 
  const drawer = (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
    >
      <div className="text-2xl flex justify-around items-center font-bold bg-black py-4">
        <Link to="/" className='text-white'>Shot News</Link>
        <button className="text-white ml-10" onClick={handleDrawerToggle}><CloseIcon /></button>

      </div>
      <List>
        <ListItem component={Link} to="/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="User Profile" />
        </ListItem>
        <ListItem component={Link} to="/create-news">
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Create News" />
        </ListItem>
        <ListItem component={Link} to="/manage-news">
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Manage News " />
        </ListItem>
        <ListItem component={Link} to="/manage-category">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Category " />
        </ListItem>
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
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      {/* <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
       
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
         
      </AppBar> */}

      <Drawer
        variant="permanent"
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
          flexGrow: 1,
          padding: '16px',
          marginLeft: drawerOpen ? drawerWidth : 0,
          transition: 'margin 0.3s',
        }}
      >
        <Toolbar />
        {/* Main content will be displayed here based on the routing handled in App.tsx */}
      </main>
    </div>
  );
};

export default AdminDashboard;
