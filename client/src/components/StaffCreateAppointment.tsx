import React, { useState } from "react";
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

import { useEffect } from "react";

interface StaffCreateAppointmentProps {
  onResetSuccess: () => void;
}

const StaffCreateAppointment: React.FC<StaffCreateAppointmentProps> = ({
  onResetSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [SoDT, setSoDT] = useState("");
  const [HoTen, setHoTen] = useState("");
  const [LyDoKham, setLyDoKham] = useState("");
  const [NgayGioKham, setNgayGioKham] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userInfo, setUserInfo] = useState([]);
  const [dentistInfo, setDentistInfo] = useState([]);

  const [selectedUserName, setSelectedUserName] = useState("");

  useEffect(() => {
    getDentistInfo();
    getUserInfo();
    if (SoDT) {
      getUserInfo();
    }
  }, []);

  const getDentistInfo = () => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/get-all-dentists`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.success && Array.isArray(response.data.dentists)) {
          setDentistInfo(response.data.dentists);
        } else {
          console.error("Unexpected response data:", response.data);
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  const getUserInfo = () => {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/employee/get-all-users`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success && Array.isArray(response.data.users)) {
          setUserInfo(response.data.users);
        } else {
          console.error("Unexpected response data:", response.data);
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  const getUserInfoByPhoneNumber = (phoneNumber: string) => {
    const user = userInfo.find((user) => user.SoDT === phoneNumber);
    if (user) {
      setSelectedUserName(user.HoTen);
    } else {
      setSelectedUserName(null);
    }
  };

  const handleSoDTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSoDT = e.target.value;
    setSoDT(newSoDT);

    if (newSoDT) {
      getUserInfoByPhoneNumber(newSoDT);
    } else {
      setSelectedUserName(null);
    }
  };

  const handleCreateAppointment = () => {
    const appointmentData = {
      NgayGioKham: NgayGioKham,
      LyDoKham: LyDoKham,
      HoTen: HoTen,
      SoDT: SoDT,
    };

    axios
      .post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/create-appointment`,
        appointmentData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Created successfully:", response);
        setSuccess("Tạo lịch hẹn cho khách thành công!");
        toast.success("Tạo lịch hẹn cho khách thành công!");
        console.log("Sent data:", JSON.parse(response.config.data));
        setTimeout(() => {
          handleClose();
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        console.error(`Error` + error);
        console.log(error.response);
        setError("Tạo lịch hẹn cho khách thất bại!");
        toast.error("Tạo lịch hẹn cho khách thất bại!");
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
        Tạo lịch hẹn mới
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
          <Typography variant='h5'>Tạo lịch hẹn mới</Typography>
          <TextField
            label='Số điện thoại bệnh nhân'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={SoDT}
            onChange={handleSoDTChange}
          />
          <TextField
            label='Tên bệnh nhân'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={
              selectedUserName !== null
                ? selectedUserName
                : "Bệnh nhân không tồn tại"
            }
            disabled
            error={selectedUserName === null}
          />
          <TextField
            label='Ngày khám'
            type='datetime-local'
            variant='outlined'
            fullWidth
            margin='normal'
            value={NgayGioKham}
            onChange={(e) => setNgayGioKham(e.target.value)}
          />
          <Box mt={1}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel id='service-label'>Tên nha sĩ</InputLabel>
              <Select
                labelId='service-label'
                label='Tên nha sĩ'
                value={HoTen}
                onChange={(e) => setHoTen(e.target.value)}
                renderValue={(selected) => (
                  <div style={{ textAlign: "left" }}>{selected}</div>
                )}
              >
                {dentistInfo.map((dentist) => (
                  <MenuItem key={dentist.Id} value={dentist.HoTen}>
                    {dentist.HoTen}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label='Lý do khám'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={LyDoKham}
            onChange={(e) => setLyDoKham(e.target.value)}
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
            onClick={handleCreateAppointment}
            sx={{ marginTop: 2 }}
          >
            Hoàn tất
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

export default StaffCreateAppointment;
