import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

interface Staff {
  email: string;
  staffName: string;
  gender: string;
  password: string;
}

const AddStaff: React.FC = () => {
  const [Staff, setStaff] = useState<Staff[]>([
    {
      email: "",
      staffName: "",
      gender: "",
      password: "",
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setStaff((prevStaff) => {
      const updatedStaff = [...prevStaff];
      updatedStaff[index] = {
        ...updatedStaff[index],
        [name]: value,
      };
      return updatedStaff;
    });
  };

  const handleAddStaff = () => {
    setStaff((prevStaff) => [
      ...prevStaff,
      {
        email: "",
        staffName: "",
        gender: "",
        password: "",
      },
    ]);
  };

  const handleRemoveStaff = (index: number) => {
    setStaff((prevStaff) => prevStaff.filter((_, i) => i !== index));
  };

  const handleSaveStaff = () => {
    // Add logic to save Staffs to your data source
    console.log("Adding Staffs:", Staff);
    // You can reset the form or perform other actions after adding the Staffs
  };

  return (
    <Box>
      <Typography variant='h4' mb={3}>
        Thêm Nhân Viên Mới
      </Typography>
      {Staff.map((Staff, index) => (
        <Box
          key={index}
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
          mb={2}
        >
          <TextField
            label='Họ và tên'
            variant='outlined'
            name='StaffName'
            value={Staff.staffName}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          <TextField
            label='Email'
            variant='outlined'
            name='email'
            value={Staff.email}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          {/* Gender check */}
          <Box display='flex' justifyContent='center'>
            <div className='form-check form-check-inline'>
              <input
                className='form-check-input'
                type='radio'
                name='inlineRadioOptions'
                id='male'
                defaultValue='option1'
              />
              <label className='form-check-label' htmlFor='inlineRadio1'>
                Nam
              </label>
            </div>
            <div className='form-check form-check-inline'>
              <input
                className='form-check-input'
                type='radio'
                name='inlineRadioOptions'
                id='female'
                defaultValue='option2'
              />
              <label className='form-check-label' htmlFor='inlineRadio2'>
                Nữ
              </label>
            </div>
          </Box>
          <TextField
            label='Mật khẩu'
            variant='outlined'
            type='password'
            name='password'
            value={Staff.password}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          {index !== 0 && (
            <Button
              variant='outlined'
              color='error'
              onClick={() => handleRemoveStaff(index)}
            >
              Xóa
            </Button>
          )}
        </Box>
      ))}
      <Button
        variant='contained'
        color='primary'
        onClick={handleAddStaff}
        sx={{ mt: 2 }}
      >
        Thêm Nhân viên mới
      </Button>
      <Button
        variant='contained'
        color='success'
        onClick={handleSaveStaff}
        sx={{ mt: 2, ml: 2 }}
      >
        Lưu Nhân viên
      </Button>
    </Box>
  );
};

export default AddStaff;
