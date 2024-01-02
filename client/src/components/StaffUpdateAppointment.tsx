import React, { useState, useEffect } from "react";
import {
  FormLabel,
  Radio,
  Box,
  Button,
  Modal,
  Typography,
  RadioGroup,
  Grid,
  TextField,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface StaffUpdateAppointmentProps {
  onResetSuccess: () => void;
}

type Appointment = {
  NgayGioKham: string;
  LyDoKham: string;
  HoTen: string;
  SoDT: string;
  MaSoHen: string;
  MaNS: string;
  MaKH: string;
};

const StaffUpdateAppointment: React.FC<StaffUpdateAppointmentProps> = ({
  onResetSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [SoDT, setSoDT] = useState("");
  const [MaSoHen, setMaSoHen] = useState("");
  const [MaKH, setMaKH] = useState("");
  const [NgayGioKham, setNgayGioKham] = useState("");
  const [MaNS, setMaNS] = useState("");
  const [LyDoKham, setLyDoKham] = useState("");

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    getAppointment();
  }, []);

  const handleSelectAppointment = (selectedMaSoHen: string) => {
    const selectedAppointment = appointments.find(
      (appointment: Appointment) => appointment.MaSoHen === selectedMaSoHen
    );
    setSelectedAppointment(selectedAppointment);
    setSoDT(selectedAppointment?.SoDT || "");
    setMaSoHen(selectedAppointment?.MaSoHen || "");
    setMaKH(selectedAppointment?.MaKH || "");
    setNgayGioKham(selectedAppointment?.NgayGioKham || "");
    setMaNS(selectedAppointment?.MaNS || "");
    setLyDoKham(selectedAppointment?.LyDoKham || "");
  };

  const getAppointment = () => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_SERVER_PORT
        }/employee/get-all-appointments`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        if (
          response.data.success &&
          Array.isArray(response.data.appointments)
        ) {
          setAppointments(response.data.appointments);
        } else {
          console.error("Unexpected response data:", response.data);
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  const handleUpdateAppointment = () => {
    const appointmentData = {
      MaSoHen: selectedAppointment?.MaSoHen,
      NgayGioKham: NgayGioKham,
    };
    axios
      .put(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/update-appointment`,
        appointmentData,
        {
          withCredentials: true,
        }
      )

      .then((response) => {
        console.log("Created successfully:", response);
        setSuccess("Cập nhật lịch hẹn thành công!");
        toast.success("Cập nhật lịch hẹn thành công!");
        console.log("Sent data:", JSON.parse(response.config.data));
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error: ", error);
        console.log("Error response: ", error.response);
        setError("Cập nhật lịch hẹn thất bại!");
        toast.error("Cập nhật lịch hẹn thất bại!");
        console.log("Sent data:", JSON.parse(error.config.data));
      });
  };
  const handleDeleteAppointment = () => {
    const appointmentData = {
      MaSoHen: selectedAppointment?.MaSoHen,
    };
    axios
      .delete(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/delete-appointment`,
        {
          data: appointmentData,
          withCredentials: true,
        }
      )

      .then((response) => {
        console.log("Created successfully:", response);
        setSuccess("Xóa lịch hẹn thành công!");
        toast.success("Xóa lịch hẹn thành công!");
        console.log("Sent data:", JSON.parse(response.config.data));
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error: ", error);
        console.log("Error response: ", error.response);
        setError("Xóa hẹn thất bại!");
        toast.error("Xóa lịch hẹn thất bại!");
        console.log("Sent data:", JSON.parse(error.config.data));
      });
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setError("");
    setSuccess("");
    setOpen(false);
  };

  return (
    <>
      <ToastContainer />
      <Button variant='contained' onClick={handleOpen}>
        CẬP NHẬT LỊCH HẸN
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "8px",
            padding: "20px",
            minWidth: "300px",
            textAlign: "center",
          }}
        >
          <Typography variant='h5'>Cập nhật lịch hẹn</Typography>
          <Box mt={1}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel id='service-label'>Chọn lịch hẹn</InputLabel>
              <Select
                labelId='service-label'
                label='Chọn lịch hẹn'
                value={selectedAppointment ? selectedAppointment.MaSoHen : ""}
                onChange={(e) =>
                  handleSelectAppointment(e.target.value as string)
                }
                renderValue={(selected) => (
                  <div style={{ textAlign: "left" }}>{selected}</div>
                )}
              >
                {appointments.map((appointment) => (
                  <MenuItem
                    key={appointment.MaSoHen}
                    value={appointment.MaSoHen}
                  >
                    {`Mã số hẹn: ${appointment.MaSoHen}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label='Số điện thoại bệnh nhân'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={SoDT}
            onChange={(e) => setSoDT(e.target.value)}
            disabled
          />
          <TextField
            label='Mã khách hàng'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={MaKH}
            disabled
          />
          <TextField
            label='Mã nha sĩ'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={MaNS}
            disabled
          />
          <TextField
            label='Ngày giờ khám'
            type='datetime-local'
            variant='outlined'
            fullWidth
            margin='normal'
            value={NgayGioKham}
            onChange={(e) => setNgayGioKham(e.target.value)}
          />

          <TextField
            label='Lý do khám'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={LyDoKham}
            disabled
          />

          {error && (
            <Typography variant='body2' color='error' sx={{ marginTop: 1 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography variant='body2' color='success' sx={{ marginTop: 1 }}>
              {success}
            </Typography>
          )}
          <Button
            variant='contained'
            color='primary'
            onClick={handleUpdateAppointment}
            sx={{ marginTop: 2 }}
          >
            Hoàn tất
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDeleteAppointment}
            sx={{ marginTop: 2, marginLeft: 3 }}
          >
            Xóa lịch hẹn
          </Button>
          <Button
            variant='outlined'
            color='error'
            onClick={handleClose}
            sx={{ marginTop: 2, marginLeft: 1 }}
          >
            Hủy
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default StaffUpdateAppointment;
