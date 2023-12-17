import React, { useEffect, useState } from "react";
import "./PatientRecord.css";
import userProfile from "../images/userProfile.svg";
import { MDBCardImage } from "mdb-react-ui-kit";
import axios from "axios"; // Import axios for making API requests
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";

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

      setMedicalRecords(response.data.medicalRecords);
      console.log(response.data.medicalRecords);
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
    <div className='patientRecord-container py-5 h-100'>
      <div className='row d-flex justify-content-center h-100'>
        <div className='col-md-4 col-lg-4 col-xl-4'>
          <div className='patient-info'>
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
            <p>Địa chỉ: {user.DiaChi}</p>
            <p>Số điện thoại: {user.SoDT}</p>
            <p>Email: {user.Email}</p>
            <p>Tuổi: {calculateAge(user.NgaySinh)}</p>
          </div>
        </div>

        <div className='medical-records col-md-8 col-lg-8 col-xl-8'>
          {/* <h3>BỆNH ÁN</h3> */}
        </div>
      </div>
    </div>
  );
}
