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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUser } from "../redux/features/auth/userSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    SoDT: "",
    HoTen: "",
    Phai: "",
    NgaySinh: "",
    DiaChi: "",
    Email: "",
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
        Email: user.Email,
      });
    }
  };

  const handleInputChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  let user = useSelector((state: RootState) => state.user.user);
  console.log("Đây là user loại", user);
  const getUserInfo = async () => {
    try {
      if (!user) {
        throw new Error("User is not defined");
      }

      let url;
      if (user.MaKH) {
        url = `${import.meta.env.VITE_REACT_SERVER_PORT}/user/me`;
      } else if (user.MaNS) {
        url = `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/me`;
      } else if (user.MaQTV) {
        url = `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/me`;
      } else if (user.MaNV) {
        url = `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/me`;
      } else {
        throw new Error("Unknown user role");
      }

      const response = await axios.get(url, { withCredentials: true });

      // handle the response data as needed
    } catch (error) {
      console.error(error);
    }
  };

  const reloadUserInfoAfterUpdate = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/me`,
        { withCredentials: true }
      );
      dispatch(
        setUser({
          user: response.data.user,
        })
      );
      return response.data.user;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formValues);
    const updatedFormValues = Object.keys(formValues).reduce((acc, key) => {
      if (formValues[key] !== "") {
        acc[key] = formValues[key];
      } else {
        acc[key] = user[key];
      }
      return acc;
    }, {});
    console.log(updatedFormValues);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/update-user-info`,
        updatedFormValues,
        { withCredentials: true }
      );
      if (response.data.success) {
        reloadUserInfoAfterUpdate();
        toast.success("Thông tin người dùng đã được cập nhật thành công", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error: any) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
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

  const renderUserInfo = () => {
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
        <ToastContainer />
      </MDBContainer>
    );
  };
  const renderDentistInfo = () => {
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
                  <MDBCardText>Role: Nha Sĩ</MDBCardText>
                </div>
              </div>
              <div
                className='p-4 text-black'
                style={{ backgroundColor: "#f8f9fa" }}
              ></div>
              <MDBCardBody className='text-black p-4'>
                <div className='mb-5'>
                  <p className='lead fw-normal mb-1'>THÔNG TIN CÁ NHÂN</p>
                  <div className='p-4' style={{ backgroundColor: "#f8f9fa" }}>
                    <MDBCardText className='font-italic mb-1'>
                      Mã Nha sĩ: {user?.MaNS}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Họ và tên: {user?.HoTen}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Tên đăng nhập: {user?.TenDangNhap}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Giới tính: {user?.Phai === "F" ? "Nữ" : "Nam"}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-0'>
                      Giới thiệu: {user?.GioiThieu}
                    </MDBCardText>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <ToastContainer />
      </MDBContainer>
    );
  };
  const renderStaffInfo = () => {
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
                  <MDBCardText>Role: Nhân Viên</MDBCardText>
                </div>
              </div>
              <div
                className='p-4 text-black'
                style={{ backgroundColor: "#f8f9fa" }}
              ></div>
              <MDBCardBody className='text-black p-4'>
                <div className='mb-5'>
                  <p className='lead fw-normal mb-1'>THÔNG TIN CÁ NHÂN</p>
                  <div className='p-4' style={{ backgroundColor: "#f8f9fa" }}>
                    <MDBCardText className='font-italic mb-1'>
                      Mã Nhân viên: {user?.MaNV}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Họ và tên: {user?.HoTen}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Tên đăng nhập: {user?.TenDangNhap}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Giới tính: {user?.Phai === "F" ? "Nữ" : "Nam"}
                    </MDBCardText>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <ToastContainer />
      </MDBContainer>
    );
  };
  const renderAdminInfo = () => {
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
                  <MDBCardText>Role: Quản trị viên</MDBCardText>
                </div>
              </div>
              <div
                className='p-4 text-black'
                style={{ backgroundColor: "#f8f9fa" }}
              ></div>
              <MDBCardBody className='text-black p-4'>
                <div className='mb-5'>
                  <p className='lead fw-normal mb-1'>THÔNG TIN CÁ NHÂN</p>
                  <div className='p-4' style={{ backgroundColor: "#f8f9fa" }}>
                    <MDBCardText className='font-italic mb-1'>
                      Mã Quản trị viên: {user?.MaQTV}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Họ và tên: {user?.HoTen}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Tên đăng nhập: {user?.TenDangNhap}
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Giới tính: {user?.Phai === "F" ? "Nữ" : "Nam"}
                    </MDBCardText>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <ToastContainer />
      </MDBContainer>
    );
  };
  return (
    <div>
      {user?.MaKH && renderUserInfo()}
      {user?.MaNS && renderDentistInfo()}
      {user?.MaNV && renderStaffInfo()}
      {user?.MaQTV && renderAdminInfo()}
    </div>
  );
}
