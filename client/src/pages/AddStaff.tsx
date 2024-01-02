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

interface Staff {
  email: string;
  staffName: string;
  userName: string;
  gender: string;
  password: string;
}

const AddStaff: React.FC = () => {
  const [staff, setStaff] = useState<Staff>({
    email: "",
    staffName: "",
    userName: "",
    gender: "M", // Default to male
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value,
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaff((prevStaff) => ({
      ...prevStaff,
      gender: e.target.value,
    }));
  };

  const handleAddStaff = async () => {
    try {
      // const formattedExpiryDate = new Date(medicine.expiryDate).toISOString();
      const staffData = {
        HoTen: staff.staffName,
        Phai: staff.gender,
        TenDangNhap: staff.userName,
        MatKhau: staff.password,
      };
      console.log(
        "Sending the following data:",
        JSON.stringify(staffData, null, 2)
      );

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/add-employee`,
        staffData,
        { withCredentials: true }
      );

      console.log("Staff added successfully:", response.data);
      toast.success("Thêm thành công");
    } catch (error: any) {
      console.error("Error adding staff:", error.message);
      toast.error("Thêm thất bại");
    }
  };

  return (
    <Box>
      <ToastContainer />
      <Typography variant='h4' mb={3}>
        Thêm Nhân Viên Mới
      </Typography>
      <TextField
        label='Họ và tên'
        variant='outlined'
        name='staffName'
        value={staff.staffName}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Tên đăng nhập'
        variant='outlined'
        name='userName'
        value={staff.userName}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <RadioGroup
        row
        aria-label='gender'
        name='gender'
        value={staff.gender}
        onChange={(e) => handleGenderChange(e)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value='M' control={<Radio />} label='Nam' />
        <FormControlLabel value='F' control={<Radio />} label='Nữ' />
      </RadioGroup>
      <TextField
        label='Mật khẩu'
        variant='outlined'
        type='password'
        name='password'
        value={staff.password}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant='contained'
        color='primary'
        onClick={handleAddStaff}
        sx={{ mt: 2 }}
      >
        Thêm Nhân viên mới
      </Button>
    </Box>
  );
};

export default AddStaff;
