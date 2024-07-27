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
    <div className="flex">
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
        }}
      >
        <Toolbar />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis,
          sequi ducimus at repellat cum illum laboriosam illo eveniet enim
          corporis fugiat officia provident nostrum. Corrupti quibusdam
          laboriosam neque illum, quod quam amet accusamus? Possimus, odit
          repellendus vel perferendis molestias sunt animi ullam. Ducimus eos
          officia laborum ut? Deleniti similique vitae nemo perspiciatis odio
          laudantium unde voluptas dignissimos nisi incidunt id, doloribus
          mollitia enim quis. Delectus voluptas, adipisci expedita deleniti ab
          mollitia. Cumque unde excepturi beatae saepe quia, fuga, nulla
          expedita tenetur repellat ullam similique corrupti deserunt quidem
          voluptate tempore! Aliquam omnis modi vel est tempora similique optio
          maxime, ipsa nesciunt, quos voluptatum aliquid quidem tempore non
          suscipit inventore. Eligendi ipsam voluptate quis aliquam perferendis
          repellendus enim, tempora dignissimos, temporibus minus doloremque
          dolorum amet odio vel, repudiandae maiores eum excepturi. Rem officia,
          est reprehenderit iusto voluptate, quae delectus quos temporibus
          eligendi laborum debitis eius odit adipisci id natus cum autem eos
          voluptatem ratione recusandae nemo ipsam exercitationem quasi.
          Reiciendis vitae doloremque perspiciatis esse quam dolor ipsam
          repudiandae. Commodi ea quibusdam, error, laborum minima et
          necessitatibus voluptatibus quo quas ducimus soluta? Quae vel
          repellendus blanditiis praesentium ad molestiae, obcaecati, modi magni
          distinctio quia beatae explicabo autem inventore doloremque error
          illum, ipsam temporibus iste velit unde quisquam reiciendis. Nihil
          dolorem at, rem dignissimos provident vel tempora laboriosam ullam
          eveniet ipsam enim hic nisi culpa recusandae numquam quos, earum
          tempore dicta adipisci? Dolore ab fugit impedit sint repellendus
          assumenda consequatur natus eum aut? Modi vero, officia consequatur
          nobis mollitia voluptatum repudiandae incidunt blanditiis ullam
          distinctio, fugit unde dolor animi velit facere magni eum quisquam
          esse minima nostrum voluptas. Tenetur magnam enim voluptatem
          dignissimos accusantium. Cumque illo ut veritatis quae pariatur earum.
          Ullam dolorem natus aliquid obcaecati similique, provident laudantium
          accusantium tempore earum. Repellat nobis ad iste assumenda incidunt
          officiis. Beatae recusandae quos obcaecati, eaque error voluptatibus
          ab, dolore a atque voluptas nihil ratione tenetur enim quidem facere
          alias nostrum numquam accusamus fuga earum veniam voluptatum
          reiciendis qui. Doloremque beatae, alias animi ullam rerum perferendis
          ipsam unde impedit maiores porro non esse libero itaque deserunt
          molestiae. Vel officia dolore officiis maiores? Id amet quibusdam
          consequuntur quod obcaecati maiores tenetur dolor aperiam eveniet
          cumque quis, iusto debitis labore ducimus consequatur consectetur
          animi temporibus accusantium blanditiis nihil explicabo sit ipsa in.
          Eius temporibus similique, delectus molestias, magni reiciendis
          tempore cum atque maxime incidunt blanditiis expedita quam sit iure
          nisi, repudiandae eaque iusto non veritatis? Alias sit delectus,
          labore aspernatur atque maxime, adipisci praesentium, quaerat
          architecto sapiente distinctio. Provident nulla suscipit, fugiat nemo
          debitis repudiandae corporis quidem est consequuntur culpa labore! Et,
          unde fugiat! Accusantium dolorem, a magni soluta, iure illum officiis
          atque repellendus perferendis, reiciendis alias temporibus
          reprehenderit esse error dolores fugit consequatur molestias eius
          iusto distinctio facere. Ullam ut vero molestiae.
        </p>
      </main>
    </div>
  );
};

export default AdminDashboard;
