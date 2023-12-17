import React, { useState } from "react";
import backgroundImage from "../images/loginBackground.png";
import "./LogIn.css";
import pictureLogin from "../images/Picture2.svg";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../redux/features/auth/userSlice.ts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Avatar from "@mui/joy/Avatar";
import FormLabel from "@mui/joy/FormLabel";
import Radio, { radioClasses } from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function LogIn2() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let loginFunction;

      switch (role) {
        case "Admin":
          loginFunction = handleLoginAdmin;
          break;
        case "Nha sĩ":
          loginFunction = handleLoginDentis;
          break;
        case "Nhân viên":
          loginFunction = handleLoginEmployee;
          break;
        default:
          // Handle default case or show an error message
          console.error("Invalid role selected");
          return;
      }

      await loginFunction(e);
    } catch (error: any) {
      console.error("An error occurred during login:", error.message);
      toast.error("Đăng Nhập thất bại");
    }
  };

  const handleLoginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/login`,
        {
          TenDangNhap: userName,
          MatKhau: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        dispatch(
          userLoggedIn({
            accessToken: response.data.accessToken,
            user: response.data.user,
          })
        );

        toast.success("Đăng Nhập thành công");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // Handle login failure, show an error message, etc.
        console.error(response.data.message);
        toast.error("Đăng Nhập thất bại");
      }
    } catch (error: any) {
      console.error("An error occurred during login:", error.message);
      toast.error("Đăng Nhập thất bại");
    }
  };
  const handleLoginDentis = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/login`,
        {
          TenDangNhap: userName,
          MatKhau: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        dispatch(
          userLoggedIn({
            accessToken: response.data.accessToken,
            user: response.data.user,
          })
        );

        toast.success("Đăng Nhập thành công");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // Handle login failure, show an error message, etc.
        console.error(response.data.message);
        toast.error("Đăng Nhập thất bại");
      }
    } catch (error: any) {
      console.error("An error occurred during login:", error.message);
      toast.error("Đăng Nhập thất bại");
    }
  };
  const handleLoginEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/login`,
        {
          TenDangNhap: userName,
          MatKhau: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        dispatch(
          userLoggedIn({
            accessToken: response.data.accessToken,
            user: response.data.user,
          })
        );

        toast.success("Đăng Nhập thành công");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // Handle login failure, show an error message, etc.
        console.error(response.data.message);
        toast.error("Đăng Nhập thất bại");
      }
    } catch (error: any) {
      console.error("An error occurred during login:", error.message);
      toast.error("Đăng Nhập thất bại");
    }
  };
  return (
    <div
      className='full-screen-background'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <div className='login-container d-flex align-items-center justify-content-center py-5 h-100'>
        <div className='row d-flex align-items-center justify-content-center h-80 w-80'>
          <div className='col-md-8 col-lg-7 col-xl-6'>
            <img src={pictureLogin} className='img-fluid' alt='Phone image' />
          </div>
          <div className='col-md-7 col-lg-5 col-xl-5 offset-xl-1'>
            <h1>ĐĂNG NHẬP</h1>
            <form onSubmit={handleLogin}>
              <h5>Chọn vai trò đăng nhập:</h5>
              <RadioGroup
                aria-label='platform'
                defaultValue=''
                onChange={(e) => setRole(e.target.value)}
                overlay
                name='platform'
                sx={{
                  flexDirection: "row",
                  gap: 2,
                  [`& .${radioClasses.checked}`]: {
                    [`& .${radioClasses.action}`]: {
                      inset: -1,
                      border: "3px solid",
                      borderColor: "primary.500",
                    },
                  },
                  [`& .${radioClasses.radio}`]: {
                    display: "contents",
                    "& > svg": {
                      zIndex: 2,
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      bgcolor: "background.surface",
                      borderRadius: "50%",
                    },
                  },
                }}
              >
                {["Admin", "Nha sĩ", "Nhân viên"].map((value) => (
                  <Sheet
                    key={value}
                    variant='outlined'
                    sx={{
                      borderRadius: "md",

                      boxShadow: "sm",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1.5,
                      p: 2,
                      minWidth: 120,
                    }}
                  >
                    <Radio
                      id={value}
                      value={value}
                      checkedIcon={<CheckCircleRoundedIcon />}
                    />
                    <Avatar variant='soft' size='sm' />
                    <FormLabel htmlFor={value}>{value}</FormLabel>
                  </Sheet>
                ))}
              </RadioGroup>
              {/* PhoneNumber input */}
              <TextField
                className='form-outline mb-4'
                id='username'
                label='Tên Đăng Nhập'
                variant='standard'
                type='text'
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
              />
              {/* Password input */}
              <TextField
                className='form-outline mb-4'
                id='password'
                label='Mật khẩu'
                variant='standard'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className='d-flex justify-content-around align-items-center mb-4'>
                {/* Checkbox */}
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    // defaultValue
                    id='form1Example3'
                    defaultChecked
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    // style={{ backgroundColor: "#51C888" }}
                  />
                  <label className='form-check-label' htmlFor='form1Example3'>
                    {" "}
                    Ghi nhớ tôi{" "}
                  </label>
                </div>
                <a href='#!' style={{ color: "#51C888" }}>
                  Quên mật khẩu?
                </a>
              </div>
              {/* Submit button */}
              <button
                type='submit'
                className='btn btn-primary btn-lg btn-block'
                style={{
                  backgroundColor: "#2AB178",
                  borderColor: "transparent",
                }}
              >
                Đăng nhập
              </button>
              <div className='divider d-flex align-items-center justify-content-center my-4'>
                <p className='text-center fw-bold mx-3 mb-0 text-muted'>HOẶC</p>
              </div>
              <a
                className='btn btn-primary btn-lg btn-block'
                style={{
                  backgroundColor: "#f7f7f7",
                  borderColor: "transparent",
                  color: "#0a0a0a",
                }}
                href='#!'
                role='button'
              >
                <i className='fab fa-google me-2' />
                Đăng nhập với Google
              </a>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}
