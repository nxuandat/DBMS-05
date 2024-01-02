import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Modal
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

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
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleAddAppointment = () => {
    navigate("/addDentistSchedule");
  }

    function handleDelete(stt: number) {
      // Prepare the data in the required format
      const requestData = {
        STT: stt,
      };

      axios
        .delete(`${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/delete-dentistschedule`, {
          withCredentials: true,
          data: requestData, // Use the data property to send the payload in the request body
        })
        .then((response) => {
          // Handle successful deletion, you might want to update the state or refresh the data
          console.log(`Appoinment ${stt} deleted successfully`);
          // Update the state or reload data
          getAppointmentsDentist();
        })
        .catch((error) => {
          // Handle error during deletion
          console.error(`Error deleting appoinment ${stt}`, error);
        });
    }
    function handleEdit(user: Appointment) {
      setEditingAppointment(user);
      setEditModalOpen(true);
    }

    function handleEditModalClose() {
      setEditModalOpen(false);
      setEditingAppointment(null);
    }

    function handleSaveChanges() {
      if (editingAppointment) {
        // Prepare the updated user data
        const updatedAppointmentData = {
          STT: editingAppointment.STT,
          GioBatDau: editingAppointment.GioBatDau,
          GioKetThuc: editingAppointment.GioKetThuc,
          TinhTrangCuocHen: editingAppointment.TinhTrangCuocHen,
        };
  
        axios
          .put(
            `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/update-dentistschedule`,
            updatedAppointmentData,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(`Appointment with ID ${editingAppointment.STT} updated successfully`);
            // Update the state or reload data
            getAppointmentsDentist();
            toast.success("Sửa lịch thành công!");
            handleEditModalClose();
          })
          .catch((error) => {
            console.error(`Error updating user with ID ${editingAppointment.STT}`, error);
          });
      }
    }

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
            <h2>Lịch hẹn theo ngày chọn:</h2>
            {filteredAppointments.map((appointment) => (
              <div key={appointment.STT} style={{ backgroundColor: '#9ED2BE', marginBottom: '15px', borderBottom: '2px solid #ccc', padding: '10px', paddingLeft: '30px', borderRadius: '10px' }}>
                <strong>Mã nha sĩ:</strong> {appointment.MaNS}. <br />
                <strong>Giờ bắt đầu:</strong> {new Date(appointment.GioBatDau).toLocaleString()}. <br />
                <strong>Giờ kết thúc:</strong> {new Date(appointment.GioKetThuc).toLocaleString()}. <br />
                <strong>Tình trạng cuộc hẹn:</strong> {appointment.TinhTrangCuocHen}. <br />
                <Button
                  variant="outlined"
                  color="error"
                  style={{ margin: "10px" }}
                  onClick={() => handleDelete(appointment.STT)}
                >
                  Hủy lịch hẹn
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  style={{ margin: "10px" }}
                  onClick={() => handleEdit(appointment)}
                >
                  Sửa lịch hẹn
                </Button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "right", alignItems: "right", marginTop: "20px" }}>
            <Button
              variant='contained'
              onClick={handleAddAppointment}
              style={{ marginRight: "10px" }}
            >
              Thêm lịch nha sĩ
            </Button>
          </div>

          <Modal
            open={editModalOpen}
            onClose={handleEditModalClose}
            disableEnforceFocus
            disableAutoFocus
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "white",
                borderRadius: "8px",
                padding: "50px",
                minWidth: "500px", // Adjust the width as needed
              }}
            >
              {/* Render the fields of the editingUser for modification */}
              <h1>Sửa lịch hẹn</h1>

              <TextField
                label='Ngày giờ bắt đầu'
                variant='outlined'
                type='datetime-local'
                value={editingAppointment?.GioBatDau || ""}
                onChange={(e) =>
                  setEditingAppointment((prevUser) => ({
                    ...prevUser!,
                    GioBatDau: e.target.value,
                  }))
                }
                sx={{ width: "100%", marginBottom: "16px" }}
              />

              <TextField
                label='Ngày giờ kết thúc'
                variant='outlined'
                type='datetime-local'
                value={editingAppointment?.GioKetThuc || ""}
                onChange={(e) =>
                  setEditingAppointment((prevUser) => ({
                    ...prevUser!,
                    GioKetThuc: e.target.value,
                  }))
                }
                sx={{ width: "100%", marginBottom: "16px" }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "16px",
                }}
              >
                <Button
                  onClick={handleSaveChanges}
                  sx={{
                    marginTop: "16px",
                    backgroundColor: "#2AB178",
                    color: "white",
                    width: "120px",
                    borderRadius: "5px",
                    ":hover": {
                      backgroundColor: "#31B373",
                    },
                  }}
                >
                  Lưu thay đổi
                </Button>
                <Button
                  onClick={handleEditModalClose}
                  sx={{
                    marginTop: "16px",
                    backgroundColor: "red",
                    color: "white",
                    width: "120px",
                    marginLeft: "2rem",
                    borderRadius: "5px",
                    ":hover": {
                      backgroundColor: "darkred",
                    },
                  }}
                >
                  Hủy
                </Button>
              </Box>
            </Box>
          </Modal>
        <ToastContainer />
      </div>
    </>
  );
}
