import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { setUser } from "../redux/features/auth/userSlice";
import { useDispatch } from "react-redux";

interface Medicine {
  drugName: string;
  unit: string;
  indication: string;
  quantity: number;
  expiryDate: string;
  price: number;
}

const AddMedicine: React.FC = () => {
  const [medicine, setMedicine] = useState<Medicine>({
    drugName: "",
    unit: "",
    indication: "",
    quantity: 0,
    expiryDate: "",
    price: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMedicine((prevMedicine) => ({
      ...prevMedicine,
      [name]: value,
    }));
  };
  const handleAddMedicine = async () => {
    try {
      // const formattedExpiryDate = new Date(medicine.expiryDate).toISOString();
      const medicineData = {
        TenThuoc: medicine.drugName,
        DonViTinh: medicine.unit,
        ChiDinh: medicine.indication,
        SoLuong: Number(medicine.quantity),
        NgayHetHan: medicine.expiryDate,
        GiaThuoc: Number(medicine.price),
      };
      console.log(
        "Sending the following data:",
        JSON.stringify(medicineData, null, 2)
      );

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/add-medicine`,
        medicineData
      );

      console.log("Medicine added successfully:", response.data);
    } catch (error: any) {
      console.error("Error adding medicine:", error.message);
    }
  };

  return (
    <Box>
      <Typography variant='h4' mb={3}>
        Thêm Thuốc Mới
      </Typography>
      <TextField
        label='Tên thuốc'
        variant='outlined'
        name='drugName'
        value={medicine.drugName}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Đơn vị tính'
        variant='outlined'
        name='unit'
        value={medicine.unit}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Chỉ định'
        variant='outlined'
        name='indication'
        value={medicine.indication}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Số lượng'
        variant='outlined'
        type='text'
        name='quantity'
        value={medicine.quantity}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Ngày hết hạn'
        variant='outlined'
        type='date'
        name='expiryDate'
        value={medicine.expiryDate}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label='Giá thuốc'
        variant='outlined'
        type='text'
        name='price'
        value={medicine.price}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant='contained'
        color='primary'
        onClick={handleAddMedicine}
        sx={{ mt: 2 }}
      >
        Thêm Thuốc
      </Button>
    </Box>
  );
};

export default AddMedicine;
