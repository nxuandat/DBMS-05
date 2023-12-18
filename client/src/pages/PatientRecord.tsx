import React, { useEffect, useState } from "react";
import "./PatientRecord.css";
import userProfile from "../images/userProfile.svg";
import { MDBCardImage } from "mdb-react-ui-kit";
import axios from "axios"; // Import axios for making API requests
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { Card, Image, List, Segment, Grid } from "semantic-ui-react";
import { Container, Row, Col } from "react-bootstrap";

export default function PatientRecord() {
  const calculateAge = (birthDateString: string) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

  const [medicalRecords, setMedicalRecords] = useState([]);

  const getMedicalRecords = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/get-medical-record`,
        { withCredentials: true }
      );

      setMedicalRecords(response.data.medicalRecord);
      console.log(response.data.medicalRecord);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo();
      user = userInfo;
      getMedicalRecords();
    };
    // Gọi hàm async vừa tạo
    fetchUserInfo();
  }, []);

  return (
    // <div className='patientRecord-container py-5 h-100'>
    //   <div className='row d-flex justify-content-center h-100'>
    //     <div className='col-md-4 col-lg-4 col-xl-4'>
    //       <div className='patient-info'>
    //         <MDBCardImage
    //           src={userProfile}
    //           alt='Generic placeholder image'
    //           className='mt-4 mb-2 img-thumbnail rounded-circle'
    //           fluid
    //           style={{ width: "150px", zIndex: "1" }}
    //         />
    //         <h2>{user.HoTen}</h2>
    //       </div>
    //       <div className='patient-full-info'>
    //         <p>Địa chỉ: {user.DiaChi}</p>
    //         <p>Số điện thoại: {user.SoDT}</p>
    //         <p>Email: {user.Email}</p>
    //         <p>Tuổi: {calculateAge(user.NgaySinh)}</p>
    //       </div>
    //     </div>

    //     <div className='medical-records col-md-8 col-lg-8 col-xl-8'>
    //       {/* <h3>BỆNH ÁN</h3> */}
    //     </div>
    //   </div>
    // </div>
    <div className='patientRecord-container py-5 h-100'>
      <Container fluid>
        <Row className='d-flex justify-content-center h-100'>
          <Col md={4} lg={4} xl={4}>
            <Segment raised>
              <div className='patient-info text-center'>
                <MDBCardImage
                  src={userProfile}
                  alt='Generic placeholder image'
                  className='mt-4 mb-2 img-thumbnail rounded-circle'
                  fluid
                  style={{ width: "150px", zIndex: "1" }}
                />
                <h2>{user.HoTen}</h2>
              </div>
              <div className='patient-full-info'>
                <List>
                  <List.Item>
                    <List.Icon name='map marker alternate' />
                    <List.Content>Địa chỉ: {user.DiaChi}</List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name='phone' />
                    <List.Content>Số điện thoại: {user.SoDT}</List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name='mail' />
                    <List.Content>Email: {user.Email}</List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name='birthday cake' />
                    <List.Content>Tuổi: {calculateAge(user.NgaySinh)}</List.Content>
                  </List.Item>
                </List>
              </div>
            </Segment>
          </Col>

          <Col md={8} lg={8} xl={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Segment raised style={{ width: '100%', margin: '10px' }}>
              <h3 className='text-center'>HỒ SƠ BỆNH ÁN</h3>
              <Card.Group itemsPerRow={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card key={medicalRecords.STT} style={{ margin: '30px' }}>
                  <Card.Content>
                    <Grid columns={2} divided>
                      <Grid.Row>
                        <Grid.Column style={{ borderLeft: '1px solid rgba(34,36,38,.15)' }}>
                          <List>
                            <List.Item>
                              <List.Icon name='user' />
                              <List.Content>Mã Khách hàng: {medicalRecords.MaKH}</List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Icon name='calendar' />
                              <List.Content>Ngày khám: {new Date(medicalRecords.NgayKham).toLocaleString()}</List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Icon name='info circle' />
                              <List.Content>Dặn dò: {medicalRecords.DanDo}</List.Content>
                            </List.Item>
                          </List>
                        </Grid.Column>
                        <Grid.Column>
                          <List>
                            <List.Item>
                              <List.Icon name='user md' />
                              <List.Content>Mã NS: {medicalRecords.MaNS}</List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Icon name='medkit' />
                              <List.Content>Mã DV: {medicalRecords.MaDV}</List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Icon name='pills' />
                              <List.Content>Mã Thuốc: {medicalRecords.MaThuoc}</List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Icon name='file invoice' />
                              <List.Content>Tình trạng xuất hóa đơn: {medicalRecords.TinhTrangXuatHoaDon}</List.Content>
                            </List.Item>
                          </List>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Card.Content>
                </Card>
              </Card.Group>

            </Segment>
          </Col>



        </Row>
      </Container>
    </div>
  );
}
