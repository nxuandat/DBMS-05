import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import axios from "axios";
import { useState, useEffect } from "react";

type Appointment = {
  MaNS: string;
  STT: number;
  GioBatDau: string;
  GioKetThuc: string;
  TinhTrangCuocHen: string;
};

export default function AppointmentDentist() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

  const getAppointmentsDentist = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_SERVER_PORT
        }/dentist/get-all-dentists-schedule`,
        { withCredentials: true }
      );
      console.log(response.data);

      // Check if the response has data.dentistsSchedules
      if (response.data && response.data.dentistsSchedules) {
        setAppointments(response.data.dentistsSchedules);
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
    getAppointmentsDentist();
  }, []);

  // Filter appointments based on the selected date
  const filteredAppointments = appointments.filter((appointment) =>
    dayjs(appointment.GioBatDau).isSame(value, "day")
  );

  return (
    <>
      <h1>Lịch hẹn Nha sĩ</h1>
      <div className='row d-flex align-items-center justify-content-center h-80 w-80'>
        <div className='col-md-8 col-lg-7 col-xl-6'>{renderCalendar()}</div>
        <div className='col-md-7 col-lg-5 col-xl-5 offset-xl-1'>
          <h2>
            <strong>Ngày đã chọn: </strong>
          </h2>
          <p style={{ fontSize: 20 }}>
            Ngày:
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
        </div>
        <h2>Lịch hẹn theo ngày chọn:</h2>
        <ul>
          {filteredAppointments.map((appointment) => (
            <li key={appointment.STT}>
              {`STT: ${appointment.STT}, GioBatDau: ${appointment.GioBatDau}, GioKetThuc: ${appointment.GioKetThuc}, TinhTrangCuocHen: ${appointment.TinhTrangCuocHen}`}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
