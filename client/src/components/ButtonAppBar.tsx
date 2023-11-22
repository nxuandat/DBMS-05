// import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import NavMenu from "./NavMenu";

export default function ButtonAppBar() {
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
