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

interface CreateMedicalRecordProps {
  onResetSuccess: () => void;
}

const CreateMedicalRecord: React.FC<CreateMedicalRecordProps> = ({
  onResetSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [SoDT, setSoDT] = useState("");
  const [DanDo, setDanDo] = useState("");
  const [TinhTrangXuatHoaDon, setTinhTrangXuatHoaDon] = useState("");
  const [TenDV, setTenDV] = useState("");
  const [TenThuoc, setTenThuoc] = useState("");
  const [NgayKham, setNgayKham] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [services, setServices] = useState([]);
  const [medicines, setMedicines] = useState([]);

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
    const updateNgayKham = () => {
      setNgayKham(getCurrentTimeInVietnam());
    };

    const intervalId = setInterval(updateNgayKham, 1000);

    updateNgayKham();
    getMedicineName();
    getServiceName();
    // console.log(NgayXuat);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const getMedicineName = () => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/get-all-medicines`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.success && Array.isArray(response.data.medicines)) {
          setMedicines(response.data.medicines);
        } else {
          console.error("Unexpected response data:", response.data);
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  const getServiceName = () => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/get-all-services`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.success && Array.isArray(response.data.services)) {
          setServices(response.data.services);
        } else {
          console.error("Unexpected response data:", response.data);
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  const handleCreateMedicalRecord = () => {
    const medicalRecordData = {
      SoDT: SoDT,
      NgayKham: NgayKham,
      DanDo: DanDo,
      TenDV: TenDV,
      TenThuoc: TenThuoc,
      TinhTrangXuatHoaDon: TinhTrangXuatHoaDon,
    };

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_SERVER_PORT
        }/dentist/create-medicalrecord`,
        medicalRecordData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Created successfully:", response);
        setSuccess("Tạo hồ sơ bệnh thành công!");
        toast.success("Tạo hồ sơ bệnh thành công!");
        console.log("Sent data:", JSON.parse(response.config.data));
        handleClose();
      })
      .catch((error) => {
        console.error(`Error` + error);
        console.log(error.response);
        setError("Tạo hồ sơ bệnh thất bại!");
        toast.error("Tạo hồ sơ bệnh thất bại!");
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
        TẠO HỒ SƠ BỆNH MỚI
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
          <Typography variant='h5'>Tạo hồ sơ bệnh mới</Typography>
          <TextField
            label='Số điện thoại bệnh nhân'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={SoDT}
            onChange={(e) => setSoDT(e.target.value)}
          />
          <TextField
            label='Ngày khám'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={NgayKham}
            disabled
          />
          {/* <TextField
            label='Tên dịch vụ'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={TenDV}
            onChange={(e) => setTenDV(e.target.value)}
          />
          <TextField
            label='Thuốc kê'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={TenThuoc}
            onChange={(e) => setTenThuoc(e.target.value)}
          /> */}
          {/* <Select
            label='Tên dịch vụ'
            value={TenDV}
            onChange={(e) => setTenDV(e.target.value)}
            variant='outlined'
            fullWidth
          >
            {services.map((service) => (
              <MenuItem key={service.Id} value={service.TenDV}>
                {service.TenDV}
              </MenuItem>
            ))}
          </Select>

          <Select
            label='Thuốc kê'
            value={TenThuoc}
            onChange={(e) => setTenThuoc(e.target.value)}
            variant='outlined'
            fullWidth
          >
            {medicines.map((medicine) => (
              <MenuItem key={medicine.Id} value={medicine.TenThuoc}>
                {medicine.TenThuoc}
              </MenuItem>
            ))}
          </Select> */}
          <Box mt={1}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel id='service-label'>Tên dịch vụ</InputLabel>
              <Select
                labelId='service-label'
                label='Tên dịch vụ'
                value={TenDV}
                onChange={(e) => setTenDV(e.target.value)}
                renderValue={(selected) => (
                  <div style={{ textAlign: "left" }}>{selected}</div>
                )}
              >
                {services.map((service) => (
                  <MenuItem key={service.Id} value={service.TenDV}>
                    {service.TenDV}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box mt={2}>
            {" "}
            {/* This creates a margin-top of 2 spacing units */}
            <FormControl variant='outlined' fullWidth>
              <InputLabel id='medicine-label'>Thuốc kê</InputLabel>
              <Select
                labelId='medicine-label'
                label='Thuốc kê'
                value={TenThuoc}
                onChange={(e) => setTenThuoc(e.target.value)}
                renderValue={(selected) => (
                  <div style={{ textAlign: "left" }}>{selected}</div>
                )}
              >
                {medicines.map((medicine) => (
                  <MenuItem key={medicine.Id} value={medicine.TenThuoc}>
                    {medicine.TenThuoc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label='Dặn dò'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={DanDo}
            onChange={(e) => setDanDo(e.target.value)}
          />

          <Grid container alignItems='center'>
            <Grid item>
              <FormLabel component='legend'>Tình trạng xuất hóa đơn</FormLabel>
            </Grid>
            <Grid item>
              <RadioGroup
                aria-label='Tình trạng xuất hóa đơn'
                name='TinhTrangThanhToan'
                value={TinhTrangXuatHoaDon}
                onChange={(e) => setTinhTrangXuatHoaDon(e.target.value)}
                // row
                sx={{ marginLeft: 1 }}
              >
                <FormControlLabel
                  value='ChuaXuat'
                  control={<Radio />}
                  label='Chưa xuất hóa đơn'
                />
                <FormControlLabel
                  value='DaXuat'
                  control={<Radio />}
                  label='Đã xuất hóa đơn'
                />
              </RadioGroup>
            </Grid>
          </Grid>

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
            onClick={handleCreateMedicalRecord}
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

export default CreateMedicalRecord;
