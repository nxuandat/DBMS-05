import styles from "./Dashboard.module.css";
import { useState, useEffect, useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { get } from "http";
// import Invoice from "../components/Invoice";
import CreateInvoice from "../components/CreateInvoice";
import PaymentAndUpdateInvoice from "../components/PaymentAndUpdateInvoice";

interface Appointment {
  MaSoHen: string;
  MaKH: string;
  MaNV: string;
  NgayGioKham: string;
  SoDT: string;
}

export function EmployeeDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [services, setServices] = useState([]);

  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/me`,
        { withCredentials: true }
      );

      if (response.data && response.data.employee) {
        setUserInfo(response.data.employee.HoTen);
        setEmployeeId(response.data.employee.MaNV);
      } else {
        console.error("Employee not found in the response.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAppointments = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_SERVER_PORT
        }/employee/get-all-appointments`,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data && response.data.appointments) {
        setAppointments(response.data.appointments);
      } else {
        console.error("Appointments not found in the response.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getInvoices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/get-all-invoices`,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data && response.data.invoices) {
        const limitedInvoices = response.data.invoices.slice(0, 3);
        setInvoices(limitedInvoices);
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
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/get-all-services`,
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
    getInvoices();
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

  const appointmentCount = appointments.length;
  const invoicesCount = 3;

  return (
    <Box
      className={styles.dashboardBody}
      component='main'
      sx={{ flexGrow: 1, p: 3 }}
    >
      <div id={styles.welcomeBanner}>
        <div className='text-white'>
          <h1>Xin Chào!</h1>
          <h4> Nhan vien {userInfo}</h4>
          <br />
          Ở đây bạn có thể xem các cuộc hẹn, các hoá đơn của phòng khám và các
          dịch vụ mà bạn cung cấp.
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
            <CreateInvoice />
          </div>
          <div style={{ marginLeft: "10px" }}>
            <PaymentAndUpdateInvoice />
          </div>
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
                Cuộc hẹn <i className='fa fa-check' aria-hidden='true'></i>
              </span>
              <hr />
              {/* Display grouped appointments here */}
              <div className={styles.dashWidgetInfoH4}>
                {Object.entries(groupedAppointments).map(
                  ([date, appointmentsByDate]) => (
                    <div key={date}>
                      <ul>
                        {appointmentsByDate.map((appointment) => (
                          <li key={appointment.STT}>
                            <strong>Mã số:</strong> {appointment.MaSoHen}
                            <br />
                            <strong>Mã khách hàng:</strong> {appointment.MaKH}
                            <br />
                            <strong>Ngày giờ khám:</strong>{" "}
                            {new Date(appointment.NgayGioKham).toLocaleString()}
                            <br />
                            <strong>Mã nha sĩ:</strong> {appointment.MaNS}
                            <br />
                            <strong>Số điện thoại:</strong> {appointment.SoDT}
                            <br />
                            <hr />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={["", styles.statCard].join(" ")}>
          <div className={styles.dashWidget}>
            <span className={styles.dashWidgetBg2}>
              <i className='fa fa-file-invoice' aria-hidden='true'></i>
            </span>
            <div className={[" ", styles.dashWidgetInfo].join(" ")}>
              <h3 className={styles.dashWidgetInfoH3}>{invoicesCount}</h3>
              <span className={styles.widgetTitle2}>
                Hoa Don Gan Day{" "}
                <i className='fa fa-check' aria-hidden='true'></i>
              </span>
              <hr />
              <div className={styles.dashWidgetInfoH4}>
                <ul>
                  {invoices.map((invoice) => (
                    <li key={invoice.MaHoaDon}>
                      <strong>Mã dịch vụ:</strong> {invoice.MaDV}
                      <br />
                      <strong>Mã khách hàng:</strong> {invoice.MaKH}
                      <br />
                      <strong>Mã nhân viên:</strong> {invoice.MaNV}
                      <br />
                      <strong>SDT:</strong> {invoice.SoDT}
                      <br />
                      <strong>Ngày xuất:</strong>{" "}
                      {new Date(invoice.NgayXuat).toLocaleString()}
                      <br />
                      <strong>Tổng Chi Phí:</strong> {invoice.TongChiPhi}
                      <br />
                      <strong>Tình trạng thanh toán:</strong>{" "}
                      {invoice.TinhTrangThanhToan}
                      <br />
                      {/* Add more details as needed */}
                    </li>
                  ))}
                </ul>
                <hr />
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
