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

export default function LogIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/login`,
        {
          SoDT: phoneNumber,
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
        <div className='row1 d-flex align-items-center justify-content-center h-80 w-80'>
          <div className='col-md-8 col-lg-7 col-xl-6'>
            <img src={pictureLogin} className='img-fluid' alt='Phone image' />
          </div>
          <div className='col-md-7 col-lg-5 col-xl-5 offset-xl-1'>
            <h1>ĐĂNG NHẬP</h1>
            <form onSubmit={handleLogin}>
              {/* PhoneNumber input */}
              <TextField
                className='form-outline mb-4'
                id='username'
                label='Số điện thoại'
                variant='standard'
                type='text'
                value={phoneNumber}
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {/* Password input */}
              <TextField
                className='form-outline mb-4'
                id='password'
                label='Mật khẩu'
                variant='standard'
                type='password'
                value={password}
                required
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
                    onChange={() => setRememberMe(!rememberMe)}
                    // style={{ backgroundColor: "#51C888" }}
                  />
                  <label className='form-check-label' htmlFor='form1Example3'>
                    {" "}
                    Ghi nhớ tôi{" "}
                  </label>
                </div>
                <a href='/forget' style={{ color: "#51C888" }}>
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
                href='/login2'
                role='button'
              >
                <i
                  className='far fa-id-badge'
                  style={{ marginRight: "10px" }}
                />
                Đăng nhập với quyền Nhân sự
              </a>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}
