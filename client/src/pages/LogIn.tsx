import React from "react";
// import backgroundImage from "./images/loginBackground.png";

export default function LogIn() {
  return (
    <section
      className='vh-100'
      //   style={{
      //     backgroundImage: `url(${backgroundImage})`,
      //   }}
    >
      <div className='container py-5 h-100'>
        <div className='row d-flex align-items-center justify-content-center h-100'>
          <div className='col-md-8 col-lg-7 col-xl-6'>
            <img
              src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg'
              className='img-fluid'
              alt='Phone image'
            />
          </div>
          <div className='col-md-7 col-lg-5 col-xl-5 offset-xl-1'>
            <form>
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
              <div className='d-flex justify-content-around align-items-center mb-4'>
                {/* Checkbox */}
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    defaultValue
                    id='form1Example3'
                    defaultChecked
                  />
                  <label className='form-check-label' htmlFor='form1Example3'>
                    {" "}
                    Ghi nhớ tôi{" "}
                  </label>
                </div>
                <a href='#!'>Quên mật khẩu?</a>
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
                <p className='text-center fw-bold mx-3 mb-0 text-muted'>OR</p>
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
    </section>
  );
}
