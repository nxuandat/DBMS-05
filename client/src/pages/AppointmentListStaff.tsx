import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import axios from "axios";
import { useState, useEffect } from "react";

interface Appointment {
  MaSoHen: string;
  NgayGioKham: string;
  LyDoKham: string;
  MaKH: string;
  MaNS: string;
  SoDT: string;
};

export default function AppointmentStaff() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

  const getAppointmentsStaff = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_SERVER_PORT
        }/employee/get-all-appointments`,
        { withCredentials: true }
      );
      console.log(response.data);

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

  const renderCalendar = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateCalendar", "DateCalendar"]}>
          <DemoItem label=''>
            <DateCalendar
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    );
  };

  useEffect(() => {
    getAppointmentsStaff();
  }, []);

  // Filter appointments based on the selected date
  const filteredAppointments = appointments.filter((appointment) =>
    dayjs(appointment.NgayGioKham).isSame(value, "day")
  );

  const renderAppointments = () => {
    if (filteredAppointments.length === 0) {
      return <p>Không có cuộc hẹn nào cho ngày đã chọn.</p>;
    }

    return filteredAppointments.map((appointment) => (
      <div key={appointment.MaSoHen} style={{ backgroundColor: '#9ED2BE', marginBottom: '15px', borderBottom: '2px solid #ccc', padding: '10px', paddingLeft: '30px', borderRadius: '10px'}}>
        <strong>Mã Số Hẹn:</strong> {appointment.MaSoHen}. <br />
        <strong>Giờ Khám:</strong> {new Date(appointment.NgayGioKham).toLocaleString()}. <br />
        <strong>Lý Do Khám:</strong> {appointment.LyDoKham}. <br />
        <strong>Khách Hàng:</strong> {appointment.MaKH}. <br />
        <strong>Số điện thoại: </strong> {appointment.SoDT}. <br />
        <strong>Nha Sĩ:</strong> {appointment.MaNS}
      </div>
    ));
  };

  return (
    <>
      <h1> <strong>Danh sách lịch hẹn</strong> </h1>
      <div className='row d-flex align-items-center justify-content-center h-80 w-80'>
        <div className='col-md-8 col-lg-7 col-xl-6'>{renderCalendar()}</div>
        <div className='col-md-7 col-lg-5 col-xl-5 offset-xl-1'>
          <h2>
            <strong>Ngày đã chọn </strong>
            <p style={{ fontSize: 20 }}>
              {value
                ? [
                    " Chủ Nhật",
                    " Thứ Hai",
                    " Thứ Ba",
                    " Thứ Tư",
                    " Thứ Năm",
                    " Thứ Sáu",
                    " Thứ Bảy",
                  ][value.day()] +
                  ", " +
                  value.format("DD-MM-YYYY")
                : "No date selected"}
            </p>
          </h2>
          {renderAppointments()}
        </div>
      </div>
    </>
  );
}
