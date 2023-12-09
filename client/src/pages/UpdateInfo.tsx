import React, { useState } from "react";
import userProfile from "../images/userProfile.svg";
import { TextField } from "@mui/material";

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

export default function UpdateInfo() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

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
                <MDBTypography tag='h5'>Nguyen Van A</MDBTypography>
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
                          defaultValue='NGUYEN VAN A'
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Ngày sinh'
                          type='date'
                          defaultValue='1999-09-01'
                          InputLabelProps={{ shrink: true }}
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Số điện thoại'
                          defaultValue='0987654321'
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Email'
                          defaultValue='nva@example.com'
                        />
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Giới tính'
                          select
                          defaultValue='Nam'
                        >
                          <option value='Nam'>Nam</option>
                          <option value='Nữ'>Nữ</option>
                        </TextField>
                      </div>
                      <div className='mb-3'>
                        <TextField
                          fullWidth
                          label='Địa chỉ'
                          defaultValue='227 Nguyễn Văn Cừ, P4, Q5, TP.HCM'
                        />
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className='p-4' style={{ backgroundColor: "#f8f9fa" }}>
                    <MDBCardText className='font-italic mb-1'>
                      Họ và tên: NGUYEN VAN A
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Ngày sinh: 01/09/1999
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Số điện thoại: 0987654321
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Email: nva@example.com
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-1'>
                      Giới tính: Nam
                    </MDBCardText>
                    <MDBCardText className='font-italic mb-0'>
                      Địa chỉ: 227 Nguyễn Văn Cừ, P4, Q5, TP.HCM
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
