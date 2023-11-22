import React from "react";
// import backgroundImage from "./images/loginBackground.png";
import "./LogIn.css";
import pictureLogin from "./images/Picture2.svg";

export default function LogIn() {
  return (
    // <section
    //   className='vh-100'
    //   //   style={{
    //   //     backgroundImage: `url(${backgroundImage})`,
    //   //   }}
    // >
    <div className='container py-5 h-100'>
      <div className='row d-flex align-items-center justify-content-center h-100'>
        <div className='col-md-8 col-lg-7 col-xl-6'>
          <img src={pictureLogin} className='img-fluid' alt='Phone image' />
        </div>
        <div className='col-md-7 col-lg-5 col-xl-5 offset-xl-1'>
          <h1>ĐĂNG KÝ</h1>
          <form>
            {/* Name input */}
            <div className='form-outline mb-4'>
              <input
                type='text'
                id='form1Example13'
                className='form-control form-control-lg'
              />
              <label className='form-label' htmlFor='form1Example13'>
                Họ và tên
              </label>
            </div>
            {/* Email input */}
            <div className='form-outline mb-4'>
              <input
                type='email'
                id='form1Example13'
                className='form-control form-control-lg'
              />
              <label className='form-label' htmlFor='form1Example13'>
                Địa chỉ email
              </label>
            </div>
            {/* Gender check */}
            <div className='form-outline mb-4'>
              <div className='form-check form-check-inline'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='inlineRadioOptions'
                  id='inlineRadio1'
                  defaultValue='option1'
                />
                <label className='form-check-label' htmlFor='inlineRadio1'>
                  Nam
                </label>
              </div>
              <div className='form-check form-check-inline'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='inlineRadioOptions'
                  id='inlineRadio2'
                  defaultValue='option2'
                />
                <label className='form-check-label' htmlFor='inlineRadio2'>
                  Nữ
                </label>
              </div>
            </div>
            {/* Phone number input */}
            <div className='form-outline mb-4'>
              <input
                type='text'
                id='form1Example13'
                className='form-control form-control-lg'
              />
              <label className='form-label' htmlFor='form1Example13'>
                Số điện thoại
              </label>
            </div>
            {/* Address input */}
            <div className='form-outline mb-4'>
              <input
                type='text'
                id='form1Example13'
                className='form-control form-control-lg'
              />
              <label className='form-label' htmlFor='form1Example13'>
                Địa chỉ
              </label>
            </div>
            {/* Birthday number input */}
            <div className='form-outline mb-4'>
              <input
                type='date'
                id='form1Example13'
                className='form-control form-control-lg'
              />
              <label className='form-label' htmlFor='form1Example13'>
                Ngày sinh
              </label>
            </div>

            {/* Password input */}
            <div className='form-outline mb-4'>
              <input
                type='password'
                id='form1Example23'
                className='form-control form-control-lg'
              />
              <label className='form-label' htmlFor='form1Example23'>
                Mật khẩu
              </label>
            </div>
            {/* Repeat Password input */}
            <div className='form-outline mb-4'>
              <input
                type='password'
                id='form1Example23'
                className='form-control form-control-lg'
              />
              <label className='form-label' htmlFor='form1Example23'>
                Nhập lại mật khẩu
              </label>
            </div>
            <div className='d-flex justify-content-around align-items-center mb-4'>
              {/* Checkbox */}
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  defaultValue
                  id='form1Example3'
                  defaultChecked
                  // style={{ backgroundColor: "#51C888" }}
                />
                <label className='form-check-label' htmlFor='form1Example3'>
                  Tôi đồng ý với các Điều khoản Dịch vụ.
                </label>
              </div>
              <a href='/login' style={{ color: "#51C888" }}>
                Đã có tài khoản? Đăng nhập
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
              Đăng ký
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
              Đăng kí với Google
            </a>
          </form>
        </div>
      </div>
    </div>
    // </section>
  );
}
