import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { styled } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from 'react-router-dom';


interface IDentistSchedule {
  MaNS: string;
  STT: number;
  GioBatDau: Date;
  GioKetThuc: Date;
  TinhTrangCuocHen: string;
  MaKH: string | null;
  SoDT: string | null;
}
const Form = styled("form")(({ theme }) => ({
  width: "400px",
  padding: theme.spacing(3),
  boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
}));

const Root = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
}));

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
  height: "50px",
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));

const Title = styled("div")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));

const AddDentistSchedule = () => {
  const [GioBatDau, setGioBatDau] = useState("");
  const [GioKetThuc, setGioKetThuc] = useState("");
  const [LyDoKham, setLyDoKham] = useState("");
  const [TinhTrangCuocHen, setTinhTrangCuocHen] = useState("");
  const [HoTen, setHoTen] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!GioBatDau || !GioKetThuc || ! TinhTrangCuocHen) {
      setError("Vui lòng nhập đầy đủ thông tin lịch hẹn nha sĩ.");
      return;
    }

    const data = {
        GioBatDau,
        GioKetThuc,
        TinhTrangCuocHen,
    };

    try {
      const config = {
        withCredentials: true,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/create-dentistschedule`,
        data,
        config
      );

      if (response.status === 201) {
        setSuccess(response.data.message);
        setGioBatDau("");
        setGioKetThuc("");
        setTinhTrangCuocHen("");
        toast.success("Đăng ký lịch hẹn thành công!");

        setTimeout(() => {
            navigate('/appointment-list-dentist');
        }, 2000);
      }
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  const handleDateChange1 = (e) => {
    const selectedDateTime = e.target.value;
    setGioBatDau(selectedDateTime);
  };
  const handleDateChange2 = (e) => {
    const selectedDateTime = e.target.value;
    setGioKetThuc(selectedDateTime);
  };

  const handleCloseError = () => {
    // Close the error popup
    setIsErrorOpen(false);
  };



  useEffect(() => {
    // Set the default value to the current time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16);
    setGioBatDau(formattedDate);

    const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000);
    const formattedEndDate = oneHourLater.toISOString().slice(0, 16);
    setGioKetThuc(formattedEndDate);

    const status = "ChuaHen";
    setTinhTrangCuocHen(status);
  }, []);

  return (
    <Root>
      <Form onSubmit={handleSubmit}>
        <Title>Thêm Lịch Nha Sĩ</Title>
        <TextFieldStyled
          id='GioBatDau'
          label='Giờ bắt đầu'
          type='datetime-local'
          value={GioBatDau}
          onChange={handleDateChange1}
          // className={classes.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AccessAlarmsIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextFieldStyled
          id='GioKetThuc'
          label='Giờ kết thúc'
          type='datetime-local'
          value={GioKetThuc}
          onChange={handleDateChange2}
          // className={classes.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AccessAlarmsIcon />
              </InputAdornment>
            ),
          }}
        />
        <Snackbar
          open={isErrorOpen}
          autoHideDuration={6000}
          onClose={handleCloseError}
        >
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={handleCloseError}
            severity='error'
          >
            {error}
          </MuiAlert>
        </Snackbar>

        <ButtonStyled
          // className={classes.button}
          variant='contained'
          style={{ backgroundColor: "#2AB178", color: "white" }}
          type='submit'
        >
          Đặt lịch hẹn
        </ButtonStyled>
      </Form>
      <ToastContainer />
    </Root>
  );
};

export default AddDentistSchedule;
