import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

interface Medicine {
  drugName: string;
  unit: string;
  indication: string;
  quantity: number;
  expiryDate: string;
  price: number;
}

const AddMedicine: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      drugName: "",
      unit: "",
      indication: "",
      quantity: 0,
      expiryDate: "",
      price: 0,
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setMedicines((prevMedicines) => {
      const updatedMedicines = [...prevMedicines];
      updatedMedicines[index] = {
        ...updatedMedicines[index],
        [name]: value,
      };
      return updatedMedicines;
    });
  };

  const handleAddMedicine = () => {
    setMedicines((prevMedicines) => [
      ...prevMedicines,
      {
        drugName: "",
        unit: "",
        indication: "",
        quantity: 0,
        expiryDate: "",
        price: 0,
      },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines((prevMedicines) =>
      prevMedicines.filter((_, i) => i !== index)
    );
  };

  const handleSaveMedicines = () => {
    // Add logic to save medicines to your data source
    console.log("Adding medicines:", medicines);
    // You can reset the form or perform other actions after adding the medicines
  };

  return (
    <Box>
      <Typography variant='h4' mb={3}>
        Thêm Thuốc Mới
      </Typography>
      {medicines.map((medicine, index) => (
        <Box
          key={index}
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
          mb={2}
        >
          <TextField
            label='Tên thuốc'
            variant='outlined'
            name='drugName'
            value={medicine.drugName}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          <TextField
            label='Đơn vị tính'
            variant='outlined'
            name='unit'
            value={medicine.unit}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          <TextField
            label='Chỉ định'
            variant='outlined'
            name='indication'
            value={medicine.indication}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          <TextField
            label='Số lượng'
            variant='outlined'
            type='text'
            name='quantity'
            value={medicine.quantity}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          <TextField
            label='Ngày hết hạn'
            variant='outlined'
            id='outlined-basic'
            type='date'
            name='expiryDate'
            value={medicine.expiryDate}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          <TextField
            label='Giá thuốc'
            variant='outlined'
            type='text'
            name='price'
            value={medicine.price}
            onChange={(e) => handleInputChange(e, index)}
            fullWidth
            sx={{ mr: 2 }}
          />
          {index !== 0 && (
            <Button
              variant='outlined'
              color='error'
              onClick={() => handleRemoveMedicine(index)}
            >
              Xóa
            </Button>
          )}
        </Box>
      ))}
      <Button
        variant='contained'
        color='primary'
        onClick={handleAddMedicine}
        sx={{ mt: 2 }}
      >
        Thêm Thuốc
      </Button>
      <Button
        variant='contained'
        color='success'
        onClick={handleSaveMedicines}
        sx={{ mt: 2, ml: 2 }}
      >
        Lưu Thuốc
      </Button>
    </Box>
  );
};

export default AddMedicine;
