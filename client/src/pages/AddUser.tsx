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

interface User {
  phoneNumber: string;
  email: string;
  fullName: string;
  gender: string;
  birthday: string;
  address: string;
  password: string;
}

const AddUser: React.FC = () => {
  const [user, setUser] = useState<User>({
    phoneNumber: "",
    email: "",
    fullName: "",
    gender: "M",
    birthday: "",
    address: "",
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({
      ...prevUser,
      gender: e.target.value,
    }));
  };

  const handleAddUser = async () => {
    try {
      const userData = {
        SoDT: user.phoneNumber,
        HoTen: user.fullName,
        Phai: user.gender,
        DiaChi: user.address,
        NgaySinh: new Date(user.birthday).toISOString(),
        MatKhau: user.password,
        Email: user.email,
      };
      console.log(
        "Sending the following data:",
        JSON.stringify(userData, null, 2)
      );

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/add-user`,
        userData,
        { withCredentials: true }
      );

      console.log("User added successfully:", response.data);
      toast.success("Thêm thành công");
    } catch (error: any) {
      console.error("Error adding user:", error.message);
      toast.error("Thêm thất bại");
    }
  };

  return (
    <Box>
      <ToastContainer />
      <Typography variant='h4' mb={3}>
        Thêm Bệnh nhân Mới
      </Typography>
      <TextField
        label='Họ và tên'
        variant='outlined'
        name='fullName'
        value={user.fullName}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Số điện thoại'
        variant='outlined'
        name='phoneNumber'
        value={user.phoneNumber}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Email'
        variant='outlined'
        name='email'
        value={user.email}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <RadioGroup
        row
        aria-label='gender'
        name='gender'
        value={user.gender}
        onChange={(e) => handleGenderChange(e)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value='M' control={<Radio />} label='Nam' />
        <FormControlLabel value='F' control={<Radio />} label='Nữ' />
      </RadioGroup>
      <TextField
        label='Ngày sinh'
        variant='outlined'
        name='birthday'
        type='date'
        value={user.birthday}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Địa chỉ'
        variant='outlined'
        name='address'
        value={user.address}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Mật khẩu'
        variant='outlined'
        type='password'
        name='password'
        value={user.password}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant='contained'
        color='primary'
        onClick={handleAddUser}
        sx={{ mt: 2 }}
      >
        Thêm Bệnh nhân mới
      </Button>
    </Box>
  );
};

export default AddUser;
