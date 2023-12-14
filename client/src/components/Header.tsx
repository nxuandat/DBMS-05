import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import NavMenu from "./NavMenu";
import { RootState } from '../redux/rootReducer';
import { useSelector, useDispatch } from "react-redux";
import { userLoggedOut } from "../redux/features/auth/userSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";

export default function Header() {
  // Khai báo biến user và dispatch từ redux store
  let user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      // Make a request to the backend to log the user out
      await axios.get(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/logout`,{ withCredentials: true });
      // Dispatch the userLoggedOut action to update the Redux store
      dispatch(userLoggedOut());
      // Close the menu
      handleMenuClose();
      // Navigate to the home page or any other desired page
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Hàm để gọi api lấy thông tin người dùng từ backend
  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/me`, { withCredentials: true });
      // console.log(response.data.user);
      
      return response.data.user;
    } catch (error: any) {
      console.log(error);
      
      return null;
    }
  };
  
  useEffect(() => {
    // Tạo một hàm async để sử dụng await
    const fetchUserInfo = async () => {
      // Gọi hàm getUserInfo và lưu kết quả vào biến userInfo
      const userInfo = await getUserInfo();
      // Nếu userInfo là null, tức là không lấy được thông tin người dùng
      if (userInfo === null) {
       
        dispatch(userLoggedOut());
      } else {
        // Nếu userInfo không phải null, tức là lấy được thông tin người dùng
        // Gán biến user bằng userInfo
        user = userInfo;
      }
    };
    // Gọi hàm async vừa tạo
    fetchUserInfo();
  }, []);

  console.log(user);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' className='bg-white shadow-sm mb-3'>
        <Toolbar>
          {/* <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            style={{
              color: "#34C38F",
            }}
          > */}
          {/* <MenuIcon /> */}
          <NavMenu />
          {/* </IconButton> */}
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}
            style={{
              color: "#0FA958",
            }}
          >
            PerfectSmile Dental
          </Typography>
          {/* Kiểm tra nếu biến user có giá trị, tức là đã đăng nhập */}
          {user ? (
            // Nếu đã đăng nhập, hiển thị icon người dùng
            <div>
              <Avatar
                alt={user.TenKH}
                src={user.Avatar}
                sx={{ width: 56, height: 56 }}
                onClick={handleMenuOpen}
              />
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem component={Link} to="/profile">
                  Thông Tin Người Dùng
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Đăng Xuất
                </MenuItem>
              </Menu>
            </div>
          ) : (
            // Nếu chưa đăng nhập, hiển thị nút đăng nhập và đăng ký
            <>
              <Button
                style={{
                  backgroundColor: "#34C38F",
                  color: "white",
                  marginRight: "10px",
                }}
                component={Link}
                to='/login'
              >
                Đăng nhập
              </Button>
              <Button
                style={{ backgroundColor: "#34C38F", color: "white" }}
                component={Link}
                to='/signup'
              >
                Đăng kí
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
