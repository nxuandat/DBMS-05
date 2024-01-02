import styles from "./Dashboard.module.css";
import { React, useState, useEffect, useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { get } from "http";
import CreateMedicalRecord from "../components/CreateMedicalRecord";
import { toast } from "react-toastify";

export function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [dentistId, setDentistId] = useState(null);
  const [services, setServices] = useState([]);

  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/me`,
        { withCredentials: true }
      );

      if (response.data && response.data.dentist) {
        setUserInfo(response.data.dentist.HoTen);
        setDentistId(response.data.dentist.MaNS);
      } else {
        console.error("Dentist not found in the response.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMedicalRecords = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_SERVER_PORT
        }/dentist/get-all-medicalrecords`,
        { withCredentials: true }
      );
      if (response.data && response.data.medicalRecords) {
        setMedicalRecords(response.data.medicalRecords);
      } else {
        console.error("Patients not found in the response.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/get-appointment`,
        { withCredentials: true }
      );
      // Check if the response has data.dentistsSchedules
      if (response.data && response.data.appointments) {
        setAppointments(response.data.appointments);
      } else {
        console.error("Appointments not found in the response.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getServices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/get-all-services`,
        { withCredentials: true }
      );

      if (response.data && response.data.services) {
        // Take only the first three services
        const limitedServices = response.data.services.slice(0, 3);
        setServices(limitedServices);
        console.log(limitedServices);
      } else {
        console.error("Services not found in the response.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAppointments();
    getMedicalRecords();
    getServices();
  }, []);

  // Group appointments by date
  const groupedAppointments = appointments
    ? appointments.reduce((acc, appointment) => {
        const date = new Date(appointment.NgayGioKham).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(appointment);
        return acc;
      }, {})
    : {};

  // Filter medical records based on dentist ID (MaNS)
  const dentistIdToShow = dentistId;
  const filteredMedicalRecords = medicalRecords.filter(
    (record) => record.MaNS === dentistIdToShow
  );

  // Group filtered medical records by appointment date (NgayKham)
  const groupedMedicalRecords = filteredMedicalRecords.reduce((acc, record) => {
    const appointmentDate = new Date(record.NgayKham).toLocaleDateString();
    if (!acc[appointmentDate]) {
      acc[appointmentDate] = [];
    }
    acc[appointmentDate].push(record);
    return acc;
  }, {});

  const appointmentCount = appointments.length;
  const recordsCount = filteredMedicalRecords.length;

  return (
    <Box
      className={styles.dashboardBody}
      component='main'
      sx={{ flexGrow: 1, p: 3 }}
    >
      <div id={styles.welcomeBanner}>
        <div className='text-white'>
          <h1>Xin Chào!</h1>
          <h4> Ns. {userInfo}</h4>
          <br />
          Ở đây bạn có thể xem các cuộc hẹn của mình, các bệnh nhân của mình và
          các dịch vụ mà bạn cung cấp.
          <br />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column", // This will stack the children vertically
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "20px",
          borderRadius: "10px",
          backgroundColor: "#A3DDBA",
          padding: "20px",
          marginTop: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            alignSelf: "center",
            top: "-50px",
            margin: "0", // This will remove the default margin
            paddingBottom: "10px",
          }}
        >
          Các thao tác{" "}
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ marginRight: "10px" }}>
            <CreateMedicalRecord
              onResetSuccess={() => {
                console.log("Medical record created successfully");
              }}
            />{" "}
          </div>
          {/* <div style={{ marginLeft: "10px" }}>
            <Invoice />
          </div> */}
        </div>
      </div>

      <div className={styles.statCardGridDoctor}>
        <div className={["", styles.statCard].join(" ")}>
          <div className={styles.dashWidget}>
            <span className={styles.dashWidgetBg3}>
              <i className=' fa fa-calendar' aria-hidden='true'></i>
            </span>
            <div className={[" ", styles.dashWidgetInfo].join(" ")}>
              <h3 className={styles.dashWidgetInfoH3}>{appointmentCount}</h3>
              <span className={styles.widgetTitle3}>
                Cuộc hẹn hôm nay{" "}
                <i className='fa fa-check' aria-hidden='true'></i>
              </span>
              <hr />
              {/* Display grouped appointments here */}
              <div className={styles.dashWidgetInfoH4}>
                {Object.entries(groupedAppointments).map(
                  ([date, appointmentsByDate]) => (
                    <div key={date}>
                      <ul>
                        {appointmentsByDate.map((appointment) => (
                          <li key={appointment.MaSoHen}>
                            <strong>Mã số hẹn:</strong> {appointment.MaSoHen}
                            <br />
                            <strong>Ngày giờ khám:</strong>{" "}
                            {new Date(appointment.NgayGioKham).toLocaleString()}
                            <br />
                            <strong>Lý do khám:</strong> {appointment.LyDoKham}
                            <br />
                            <strong>Mã NS:</strong> {appointment.MaNS}
                            <br />
                            <strong>Mã KH:</strong> {appointment.MaKH}
                            <br />
                            <strong>Số ĐT:</strong> {appointment.SoDT}
                            <br />
                            <strong>Họ tên:</strong> {appointment.HoTen}
                            <br />
                            <hr />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
              {/* {appointments.map((appointment, index) => (
                <div className={styles.dashWidgetInfoH4}>
                  <li>
                    <div key={index}>
                      <p>Mã số hẹn: {appointment.MaSoHen}</p>
                      <p>
                        Ngày giờ khám:{" "}
                        {new Date(appointment.NgayGioKham).toLocaleString()}
                      </p>
                      <p>Lý do khám: {appointment.LyDoKham}</p>
                      <p>Mã NS: {appointment.MaNS}</p>
                      <p>Mã KH: {appointment.MaKH}</p>
                      <p>Số ĐT: {appointment.SoDT}</p>
                      <p>Họ tên: {appointment.HoTen}</p>
                    </div>
                  </li>
                </div>
              ))} */}
            </div>
          </div>
        </div>
        <div className={["", styles.statCard].join(" ")}>
          <div className={styles.dashWidget}>
            <span className={styles.dashWidgetBg2}>
              <i className='fa fa-user' aria-hidden='true'></i>
            </span>
            <div className={[" ", styles.dashWidgetInfo].join(" ")}>
              <h3 className={styles.dashWidgetInfoH3}>{recordsCount}</h3>
              <span className={styles.widgetTitle2}>
                Bệnh nhân gần đây{" "}
                <i className='fa fa-check' aria-hidden='true'></i>
              </span>
              <hr />
              <div className={styles.dashWidgetInfoH4}>
                {Object.entries(groupedMedicalRecords).map(
                  ([date, records]) => (
                    <div key={date}>
                      <ul>
                        {records.map((record) => (
                          <li key={record.STT}>
                            <strong>ID:</strong> {record.MaKH}
                            <br />
                            <strong>SDT:</strong> {record.SoDT}
                            <br />
                            <strong>Ngày khám:</strong>{" "}
                            {new Date(record.NgayKham).toLocaleString()}
                            <br />
                            <strong>Lí do khám:</strong> {record.DanDo}
                            <br />
                            {/* Add more details as needed */}
                          </li>
                        ))}
                      </ul>
                      <hr />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={["", styles.statCard].join(" ")}>
          <div className={styles.dashWidget}>
            <span className={styles.dashWidgetBg4}>
              <i className='fa fa-heartbeat' aria-hidden='true'></i>
            </span>
            <div className={[" ", styles.dashWidgetInfo].join(" ")}>
              <h3 className={styles.dashWidgetInfoH3}>{3}</h3>
              <span className={styles.widgetTitle4}>
                Dịch vụ hay sử dụng{" "}
                <i className='fa fa-check' aria-hidden='true'></i>
              </span>
              <hr />
              <div className={styles.dashWidgetInfoH4}>
                <ul>
                  {services.map((service) => (
                    <li key={service.MaDV}>
                      <strong>ID:</strong> {service.MaDV}
                      <br />
                      <strong>Tên dịch vụ:</strong> {service.TenDV}
                      <br />
                      <strong>Mô tả</strong> {service.MoTa}
                      <br />
                      <hr />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
