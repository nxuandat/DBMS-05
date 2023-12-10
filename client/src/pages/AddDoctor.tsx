import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

interface Doctor {
  email: string;
  doctorName: string;
  gender: string;
  doctorInfo: string;
  password: string;
}

const AddDoctor: React.FC = () => {
  const [gender, setGender] = useState("");
  const [doctor, setDoctor] = useState<Doctor[]>([
    {
      email: "",
      doctorName: "",
      gender: "",
      doctorInfo: "",
      password: "",
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setDoctor((prevDoctor) => {
      const updatedDoctor = [...prevDoctor];
      updatedDoctor[index] = {
        ...updatedDoctor[index],
        [name]: value,
      };
      return updatedDoctor;
    });
  };

  const handleAddDoctor = () => {
    setDoctor((prevDoctor) => [
      ...prevDoctor,
      {
        email: "",
        doctorName: "",
        gender: "",
        doctorInfo: "",
        password: "",
      },
    ]);
  };

  const handleRemoveDoctor = (index: number) => {
    setDoctor((prevDoctor) => prevDoctor.filter((_, i) => i !== index));
  };

  const handleSaveDoctor = () => {
    // Add logic to save Doctors to your data source
    console.log("Adding doctors:", doctor);
    // You can reset the form or perform other actions after adding the Doctors
  };

  return (
    <Box>
      <Typography variant='h4' mb={3}>
        Thêm Nha Sĩ Mới
      </Typography>
      {doctor.map((doctor, index) => (
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
            name='doctorName'
            value={doctor.doctorName}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          <TextField
            label='Email'
            variant='outlined'
            name='email'
            value={doctor.email}
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
                id='inlineRadio1'
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
                id='inlineRadio2'
                defaultValue='option2'
              />
              <label className='form-check-label' htmlFor='inlineRadio2'>
                Nữ
              </label>
            </div>
          </Box>
          <TextField
            label='Giới thiệu'
            variant='outlined'
            type='text'
            name='doctorInfo'
            value={doctor.doctorInfo}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          <TextField
            label='Mật khẩu'
            variant='outlined'
            type='password'
            name='password'
            value={doctor.password}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          {index !== 0 && (
            <Button
              variant='outlined'
              color='error'
              onClick={() => handleRemoveDoctor(index)}
            >
              Xóa
            </Button>
          )}
        </Box>
      ))}
      <Button
        variant='contained'
        color='primary'
        onClick={handleAddDoctor}
        sx={{ mt: 2 }}
      >
        Thêm Nha sĩ mới
      </Button>
      <Button
        variant='contained'
        color='success'
        onClick={handleSaveDoctor}
        sx={{ mt: 2, ml: 2 }}
      >
        Lưu Nha Sĩ
      </Button>
    </Box>
  );
};

export default AddDoctor;
