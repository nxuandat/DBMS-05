import React, { useState } from "react";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@mui/material/InputAdornment';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { makeStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    width: '400px',
    padding: theme.spacing(3),
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
}));

const AppointmentForm = () => {
  const classes = useStyles();
  const [NgayGioKham, setNgayGioKham] = useState("");
  const [LyDoKham, setLyDoKham] = useState("");
  const [MaNS, setMaNS] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!NgayGioKham || !LyDoKham || !MaNS) {
      setError("Vui lòng nhập đầy đủ thông tin lịch hẹn nha sĩ.");
      return;
    }

    const data = {
      NgayGioKham,
      LyDoKham,
      MaNS,
    };

    try {
      const config = {
        withCredentials: true,
      };
      const response = await axios.post(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/create-appointment`, data, config);

      if (response.status === 201) {
        setSuccess(response.data.message);
        setNgayGioKham("");
        setLyDoKham("");
        setMaNS("");
        toast.success("Đăng ký lịch hẹn thành công!");
      }
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.title}>Đặt lịch hẹn</div>
        <TextField
          id="NgayGioKham"
          label="Ngày giờ khám"
          type="datetime-local"
          value={NgayGioKham}
          onChange={(e) => setNgayGioKham(e.target.value)}
          className={classes.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessAlarmsIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="LyDoKham"
          label="Lý do khám"
          type="text"
          value={LyDoKham}
          onChange={(e) => setLyDoKham(e.target.value)}
          className={classes.textField}
          multiline
          rows={4} // Điều chỉnh số dòng hiển thị cho ô văn bản
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon style={{ marginTop: '-50px' }}/>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="MaNS"
          label="Mã nha sĩ"
          type="text"
          value={MaNS}
          onChange={(e) => setMaNS(e.target.value)}
          className={classes.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          className={classes.button}
          variant="contained"
          style={{ backgroundColor: "#2AB178", color: "white" }}
          type="submit"
        >
          Đặt lịch hẹn
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AppointmentForm;
