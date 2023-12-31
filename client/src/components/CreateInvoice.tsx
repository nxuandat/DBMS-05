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
} from "@mui/material";

import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface CreateInvoiceProps {
  onResetSuccess: () => void;
}

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ onResetSuccess }) => {
  const [open, setOpen] = useState(false);
  const [SoDT, setSoDT] = useState("");
  const [TongChiPhi, setTongChiPhi] = useState("");
  const [TinhTrangThanhToan, setTinhTrangThanhToan] = useState("");
  const [TenDV, setTenDV] = useState("");
  const [NgayXuat, setNgayXuat] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getCurrentTimeInVietnam = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    const currentTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return currentTime;
  };

  useEffect(() => {
    const updateNgayXuat = () => {
      setNgayXuat(getCurrentTimeInVietnam());
    };

    // Call the updateNgayXuat function every 5 seconds
    const intervalId = setInterval(updateNgayXuat, 1000);

    // Initial update
    updateNgayXuat();
    // console.log(NgayXuat);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleCreateInvoice = () => {
    const invoiceData = {
      SoDT: SoDT,
      NgayXuat: NgayXuat,
      TongChiPhi: TongChiPhi,
      TinhTrangThanhToan: TinhTrangThanhToan,
      TenDV: TenDV,
    };

    axios
      .post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/create-invoice`,
        invoiceData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Created successfully:", response);
        setSuccess("Tạo hóa đơn thành công!");
        toast.success("Tạo hóa đơn thành công!");
        console.log("Sent data:", JSON.parse(response.config.data));
        handleClose();
      })
      .catch((error) => {
        console.error(`Error` + error);
        console.log(error.response);
        setError("Tạo hóa đơn thất bại!");
        toast.error("Tạo hóa đơn thất bại!");
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
      <Button variant='contained' onClick={handleOpen}>
        TẠO HÓA ĐƠN
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
          <Typography variant='h5'>Tạo mới hóa đơn</Typography>
          <TextField
            label='Số điện thoại khách'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={SoDT}
            onChange={(e) => setSoDT(e.target.value)}
          />
          <TextField
            label='Ngày xuất hóa đơn'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={NgayXuat}
            disabled
          />
          <TextField
            label='Tên dịch vụ'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={TenDV}
            onChange={(e) => setTenDV(e.target.value)}
          />
          <Grid container alignItems='center'>
            <Grid item>
              <FormLabel component='legend'>Tình trạng thanh toán</FormLabel>
            </Grid>
            <Grid item>
              <RadioGroup
                aria-label='Tình trạng thanh toán'
                name='TinhTrangThanhToan'
                value={TinhTrangThanhToan}
                onChange={(e) => setTinhTrangThanhToan(e.target.value)}
                // row
                sx={{ marginLeft: 1 }}
              >
                <FormControlLabel
                  value='DaThanhToan'
                  control={<Radio />}
                  label='Đã Thanh Toán'
                />
                <FormControlLabel
                  value='ChuaThanhToan'
                  control={<Radio />}
                  label='Chưa Thanh Toán'
                />
              </RadioGroup>
            </Grid>
          </Grid>
          <TextField
            label='Tổng chi phí'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={TongChiPhi}
            onChange={(e) => setTongChiPhi(e.target.value)}
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
            onClick={handleCreateInvoice}
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

export default CreateInvoice;
