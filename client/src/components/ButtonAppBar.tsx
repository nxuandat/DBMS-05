// import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' className='bg-white shadow-sm mb-3'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            style={{
              color: "#34C38F",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}
            style={{
              color: "#0FA958",
            }}
          >
            PHÒNG KHÁM NHA KHOA
          </Typography>
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
        </Toolbar>
      </AppBar>
    </Box>
  );
}
