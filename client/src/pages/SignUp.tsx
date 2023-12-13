import React from "react";
// import backgroundImage from "./images/loginBackground.png";
import "./LogIn.css";
import pictureLogin from "../images/Picture2.svg";
import { TextField } from "@mui/material";
import PasswordChecklist from "react-password-checklist";
import { useState } from "react";
import axios from 'axios'
import { userRegistration } from "../redux/features/auth/userSlice";
import { useDispatch } from "react-redux";
import { format } from 'date-fns';
import Verification from "../components/VerificationModal";
import CustomModal from "../utils/CustomModal";

export default function LogIn() {
  const dispatch = useDispatch();
  const [isRegistrationSuccess, setRegistrationSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState(""); 
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMeetsCriteria, setPasswordMeetsCriteria] = useState(false);

  const customMessages = {
    minLength: "Tối thiểu 8 ký tự",
    specialChar: "Ít nhất một ký tự đặc biệt",
    number: "Ít nhất một chữ số",
    capital: "Ít nhất một chữ in hoa",
    match: "Mật khẩu không khớp",
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    try {
      const formattedBirthday = format(new Date(birthday), "yyyy-MM-dd'T'00:00:00.000'Z'");
      console.log(gender);
      const userData = {
        SoDT: phoneNumber, 
        HoTen: name,
        Phai: gender, 
        NgaySinh: formattedBirthday,
        DiaChi: address,
        MatKhau: password,
        Email: email,
      };
  
      // Gửi dữ liệu đăng ký lên server
      const response = await axios.post(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/registration`, userData);
  
      // Xử lý kết quả từ server nếu cần
      // console.log(response.data);
      setRegistrationSuccess(true);
      dispatch(
        userRegistration({
          token: response.data.activationToken,
        })
      );
  
      
    } catch (error:any) {
      // Xử lý lỗi nếu có
      console.error('Error during registration:', error.message);
    }
  };
  return (
    <div className='container py-5 h-100'>
      <div className='row d-flex align-items-center justify-content-center h-100'>
        <div className='col-md-8 col-lg-7 col-xl-6'>
          <img src={pictureLogin} className='img-fluid' alt='Phone image' />
        </div>
        <div className='col-md-7 col-lg-5 col-xl-5 offset-xl-1'>
          <h1>ĐĂNG KÝ</h1>
          <form>
            {/* Name input */}
            <TextField
              className='form-outline mb-4 '
              id='name'
              label='Họ và tên'
              variant='outlined'
              type='text'
              onChange={(e) => setName(e.target.value)}
            />
            {/* Email input */}
            <TextField
              className='form-outline mb-4'
              id='email'
              label='Địa chỉ email'
              variant='outlined'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Gender check */}
            <div className='form-outline mb-4'>
              <div className='form-check form-check-inline'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='inlineRadioOptions'
                  id='inlineRadio1'
                  name='genderOptions'
                  value='M'
                  onChange={(e) => setGender(e.target.value)}
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
                  name='genderOptions'
                  value='F'
                  onChange={(e) => setGender(e.target.value)}
                />
                <label className='form-check-label' htmlFor='inlineRadio2'>
                  Nữ
                </label>
              </div>
            </div>
            {/* Phone number input */}
            <TextField
              className='form-outline mb-4'
              id='phoneNumber'
              label='Số điện thoại'
              variant='outlined'
              type='text'
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {/* Address input */}
            <TextField
              className='form-outline mb-4'
              id='address'
              label='Địa chỉ'
              variant='outlined'
              type='text'
              onChange={(e) => setAddress(e.target.value)}
            />
            {/* Birthday number input */}
            <TextField
              className='form-outline mb-4'
              id='birthday'
              label='Ngày sinh'
              variant='outlined'
              type='date'
              onChange={(e) => setBirthday(e.target.value)}
            />

            {/* Password input */}
            <TextField
              className='form-outline mb-4'
              id='password'
              label='Mật khẩu'
              variant='outlined'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Confirm Password input */}
            <TextField
              className='form-outline mb-4'
              id='confirmPassword'
              label='Nhập lại mật khẩu'
              variant='outlined'
              type='password'
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={password}
              valueAgain={confirmPassword}
              onChange={(isValid) => setPasswordMeetsCriteria(isValid)}
              messages={customMessages}
            />
            <div style={{ color: passwordMeetsCriteria ? "#31B373" : "red" }}>
              Mật khẩu {passwordMeetsCriteria ? "đã" : "không"} đáp ứng các tiêu
              chí
            </div>
            <div className='d-flex justify-content-around align-items-center mb-4'>
              {/* Checkbox */}
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  //defaultValue
                  id='terms'
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
              disabled={!passwordMeetsCriteria}
              onClick={handleSignUp}
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
          {isRegistrationSuccess && (
            <CustomModal
              open={isRegistrationSuccess}
              setOpen={setRegistrationSuccess}
              component={Verification}
              // refetch={refetch}
            />
          )}
        </div>
      </div>
    </div>
    // </section>
  );
}


