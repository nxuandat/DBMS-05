import React, { useState, useEffect } from "react";
import axios from "axios";
import userProfile from "../images/userProfile.svg";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { useDispatch } from "react-redux";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUser } from "../redux/features/auth/userSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    SoDT: '',
    HoTen: '',
    Phai: '',
    NgaySinh: '',
    DiaChi: '',
    Email: ''
  });
  



  const handleEditClick = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
    if (!isEditing) {
      setFormValues({
        SoDT: user.SoDT,
        HoTen: user.HoTen,
        Phai: user.Phai,
        NgaySinh: user.NgaySinh,
        DiaChi: user.DiaChi,
        Email: user.Email
      });
    }
  };

  const handleInputChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value
    });
  };

  let user = useSelector((state: RootState) => state.user.user);



  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/me`,
        { withCredentials: true }
      );

      dispatch(setUser({
        user: response.data.user,
      })
      )

      return response.data.user;
    } catch (error: any) {
      console.log(error);

      return null;
    }
  };

  

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formValues);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/update-user-info`,
        formValues,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success('Thông tin người dùng đã được cập nhật thành công', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
       
      }
    } catch (error:any) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
      
    }
  };
  

  

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo();
      user = userInfo;
    };
    // Gọi hàm async vừa tạo
    fetchUserInfo();
  }, []);

  return (
    <MDBContainer className='py-5 h-100'>
      <MDBRow className='justify-content-center align-items-center h-100'>
        <MDBCol lg='12' xl='12'>
          <MDBCard>
            <div
              className='rounded-top text-white d-flex flex-row'
              style={{ backgroundColor: "#31B373", height: "200px" }}
            >
              <div
                className='ms-4 mt-5 d-flex flex-column'
                style={{ width: "150px" }}
              >
                <MDBCardImage
                  src={userProfile}
                  alt='Generic placeholder image'
                  className='mt-4 mb-2 img-thumbnail rounded-circle'
                  fluid
                  style={{ width: "150px", zIndex: "1" }}
                />
                <MDBBtn
                  outline
                  color='dark'
                  style={{ height: "36px", overflow: "visible" }}
                  onClick={handleEditClick}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </MDBBtn>
              </div>
              <div className='ms-3' style={{ marginTop: "130px" }}>
                <MDBTypography tag='h5'>{user.HoTen}</MDBTypography>
                <MDBCardText>Role: Bệnh nhân</MDBCardText>
              </div>
            </div>
            <div
              className='p-4 text-black'
              style={{ backgroundColor: "#f8f9fa" }}
            ></div>
            <MDBCardBody className='text-black p-4'>
              <div className='mb-5'>
                <p className='lead fw-normal mb-1'>THÔNG TIN CÁ NHÂN</p>
                {isEditing ? (
                  <div className='p-4' style={{ backgroundColor: "#f8f9fa" }}>
                    <form onSubmit={handleFormSubmit}>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Họ và tên'
                          name='HoTen'
                          defaultValue={user?.HoTen}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Ngày sinh'
                          name='NgaySinh'
                          type='date'
                          defaultValue={user?.NgaySinh}
                          onChange={handleInputChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Số điện thoại'
                          name='SoDT'
                          defaultValue={user?.SoDT}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Email'
                          name='Email'
                          defaultValue={user?.Email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Giới tính'
                          name='Phai'
                          select
                          defaultValue='Nam'
                          onChange={handleInputChange}
                        >
                          <option value='M'>Nam</option>
                          <option value='F'>Nữ</option>
                        </TextField>
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Địa chỉ'
                          name='DiaChi'
                          defaultValue={user?.DiaChi}
                          onChange={handleInputChange}
                        />
                      </div>
                      <MDBBtn type='submit'>Lưu thông tin</MDBBtn>
                    </form>
                  </div>
                ) : (
                  <div className='p-4' style={{ backgroundColor: "#f8f9fa" }}>
                    <MDBCardText className='font-italic mb-1'>
                      Họ và tên: {user?.HoTen}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Ngày sinh:{" "}
                      {new Date(user?.NgaySinh).toLocaleDateString("vi-VN")}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Số điện thoại: {user?.SoDT}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Email: {user?.Email}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Giới tính: {user?.Phai === "F" ? "Nữ" : "Nam"}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-0'>
                      Địa chỉ: {user?.DiaChi}
                    </MDBCardText>
                  </div>
                )}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <ToastContainer/>
    </MDBContainer>
  );
}


