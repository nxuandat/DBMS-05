import React, { useState, useEffect } from "react";
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

interface PaymentAndUpdateInvoiceProps {
  onResetSuccess: () => void;
}

type Invoice = {
  MaHoaDon: string;
  MaKH: string;
  SoDT: string;
  STT: string;
  NgayXuat: string;
  TongChiPhi: string;
  TinhTrangThanhToan: string;
  MaNV: string;
  MaDV: string;
};

const PaymentAndUpdateInvoice: React.FC<PaymentAndUpdateInvoiceProps> = ({
  onResetSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [SoDT, setSoDT] = useState("");
  const [MaHoaDon, setMaHoaDon] = useState("");
  const [MaKH, setMaKH] = useState("");
  const [STT, setSTT] = useState("");
  const [NgayXuat, setNgayXuat] = useState("");
  const [TongChiPhi, setTongChiPhi] = useState("");
  const [TinhTrangThanhToan, setTinhTrangThanhToan] = useState("");
  const [MaNV, setMaNV] = useState("");
  const [MaDV, setMaDV] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    getInvoice(); // Invoke the getInvoice function
  }, []);

  const handleSelectInvoice = (selectedMaHoaDon: string) => {
    const selectedInvoice = invoices.find(
      (invoice: Invoice) => invoice.MaHoaDon === selectedMaHoaDon
    );
    setSelectedInvoice(selectedInvoice);
    setSoDT(selectedInvoice?.SoDT || "");
    setMaKH(selectedInvoice?.MaKH || "");
    setNgayXuat(selectedInvoice?.NgayXuat || "");
    setMaNV(selectedInvoice?.MaNV || "");
    setMaDV(selectedInvoice?.MaDV || "");
    setTongChiPhi(selectedInvoice?.TongChiPhi || "");
    setTinhTrangThanhToan(selectedInvoice?.TinhTrangThanhToan || "");
  };

  const getInvoice = () => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/get-all-invoices`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.success && Array.isArray(response.data.invoices)) {
          setInvoices(response.data.invoices);
        } else {
          console.error("Unexpected response data:", response.data);
        }
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  const handleUpdateInvoice = () => {
    const invoiceData = {
      MaHoaDon: selectedInvoice?.MaHoaDon,
      TongChiPhi: TongChiPhi,
      TinhTrangThanhToan: TinhTrangThanhToan,
    };
    axios
      .put(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/employee/update-invoice`,
        invoiceData,
        {
          withCredentials: true,
        }
      )

      .then((response) => {
        console.log("Created successfully:", response);
        setSuccess("Cập nhật hóa đơn thành công!");
        toast.success("Cập nhật hóa đơn thành công!");
        console.log("Sent data:", JSON.parse(response.config.data));
        handleClose();
      })
      .catch((error) => {
        console.error("Error: ", error);
        console.log("Error response: ", error.response);
        setError("Cập nhật hóa đơn thất bại!");
        toast.error("Cập nhật hóa đơn thất bại!");
        console.log("Sent data:", JSON.parse(error.config.data));
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
        CẬP NHẬT HÓA ĐƠN
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
          <Typography variant='h5'>Cập nhật hóa đơn</Typography>
          <Box mt={1}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel id='service-label'>Chọn hóa đơn</InputLabel>
              <Select
                labelId='service-label'
                label='Chọn hóa đơn'
                value={selectedInvoice ? selectedInvoice.MaHoaDon : ""}
                onChange={(e) => handleSelectInvoice(e.target.value as string)}
                renderValue={(selected) => (
                  <div style={{ textAlign: "left" }}>{selected}</div>
                )}
              >
                {invoices.map((invoice) => (
                  <MenuItem key={invoice.MaHoaDon} value={invoice.MaHoaDon}>
                    {`Mã hóa đơn: ${invoice.MaHoaDon}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label='Số điện thoại bệnh nhân'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={SoDT}
            onChange={(e) => setSoDT(e.target.value)}
            disabled
          />
          <TextField
            label='Ngày khám'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={NgayXuat}
            disabled
          />
          <TextField
            label='Mã dịch vụ'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={MaDV}
            disabled
          />
          <TextField
            label='Mã nhân viên'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={MaNV}
            disabled
          />

          <TextField
            label='Tổng chi phí'
            type='text'
            variant='outlined'
            fullWidth
            margin='normal'
            value={TongChiPhi}
            onChange={(e) => setTongChiPhi(e.target.value)}
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
                sx={{ marginLeft: 1 }}
              >
                <FormControlLabel
                  value='ChuaThanhToan'
                  control={<Radio />}
                  label='Chưa thanh toán'
                />
                <FormControlLabel
                  value='DaThanhToan'
                  control={<Radio />}
                  label='Đã thanh toán'
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
            onClick={handleUpdateInvoice}
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

export default PaymentAndUpdateInvoice;
