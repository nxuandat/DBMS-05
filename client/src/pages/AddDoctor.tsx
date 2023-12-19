import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Doctor {
  doctorName: string;
  userName: string;
  gender: string;
  doctorInfo: string;
  password: string;
}

const AddDoctor: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor>({
    doctorName: "",
    userName: "",
    doctorInfo: "",
    gender: "M", // Default to male
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      gender: e.target.value,
    }));
  };

  const handleAddDoctor = async () => {
    try {
      // const formattedExpiryDate = new Date(medicine.expiryDate).toISOString();
      const doctorData = {
        HoTen: doctor.doctorName,
        Phai: doctor.gender,
        TenDangNhap: doctor.userName,
        GioiThieu: doctor.doctorInfo,
        MatKhau: doctor.password,
      };
      console.log(
        "Sending the following data:",
        JSON.stringify(doctorData, null, 2)
      );

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/add-dentist`,
        doctorData,
        { withCredentials: true }
      );

      console.log("Dentist added successfully:", response.data);
      toast.success("Thêm thành công");
    } catch (error: any) {
      console.error("Error adding dentist:", error.message);
      toast.error("Thêm thất bại");
    }
  };

  return (
    <Box>
      <ToastContainer />
      <Typography variant='h4' mb={3}>
        Thêm Nha Sĩ Mới
      </Typography>
      <TextField
        label='Họ và tên'
        variant='outlined'
        name='doctorName'
        value={doctor.doctorName}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Tên đăng nhập'
        variant='outlined'
        name='userName'
        value={doctor.userName}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <RadioGroup
        row
        aria-label='gender'
        name='gender'
        value={doctor.gender}
        onChange={(e) => handleGenderChange(e)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value='M' control={<Radio />} label='Nam' />
        <FormControlLabel value='F' control={<Radio />} label='Nữ' />
      </RadioGroup>
      <TextField
        label='Giới thiệu'
        variant='outlined'
        type='text'
        name='doctorInfo'
        value={doctor.doctorInfo}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Mật khẩu'
        variant='outlined'
        type='password'
        name='password'
        value={doctor.password}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant='contained'
        color='primary'
        onClick={handleAddDoctor}
        sx={{ mt: 2 }}
      >
        Thêm Nha sĩ mới
      </Button>
    </Box>
  );
};

export default AddDoctor;
