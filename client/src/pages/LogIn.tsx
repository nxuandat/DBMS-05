import React from "react";
import backgroundImage from "../images/loginBackground.png";
import "./LogIn.css";
import pictureLogin from "../images/Picture2.svg";
import { TextField } from "@mui/material";

export default function LogIn() {
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
          <form>
            {/* Email input */}
            <TextField
              className='form-outline mb-4'
              id='username'
              label='Email'
              variant='standard'
              type='email'
            />
            {/* Password input */}
            <TextField
              className='form-outline mb-4'
              id='password'
              label='Mật khẩu'
              variant='standard'
              type='password'
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
        </div>
      </div>
    </div>
  </div>
  );
}
