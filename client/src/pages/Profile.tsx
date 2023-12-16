import React, { useState, useEffect } from "react";
import axios from "axios";
import userProfile from "../images/userProfile.svg";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";

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

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  let user = useSelector((state: RootState) => state.user.user);

  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/me`,
        { withCredentials: true }
      );

      return response.data.user;
    } catch (error: any) {
      console.log(error);

      return null;
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
                    <form>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Họ và tên'
                          defaultValue={user?.HoTen}
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Ngày sinh'
                          type='date'
                          defaultValue={user?.NgaySinh}
                          InputLabelProps={{ shrink: true }}
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Số điện thoại'
                          defaultValue={user?.SoDT}
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Email'
                          defaultValue={user?.Email}
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Giới tính'
                          select
                          defaultValue='Nam'
                        >
                          <option value='M'>Nam</option>
                          <option value='F'>Nữ</option>
                        </TextField>
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Địa chỉ'
                          defaultValue={user?.DiaChi}
                        />
                      </div>
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
    </MDBContainer>
  );
}
