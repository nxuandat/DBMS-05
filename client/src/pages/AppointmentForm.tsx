import React, { useState, useEffect } from "react";
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
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface IDentist {
  MaNS: string;
  TenDangNhap: string | null;
  HoTen: string;
  Phai: string;
  GioiThieu: string;
  MatKhau: string | null;
}

interface IDentistSchedule {
  MaNS: string;
  STT: number;
  GioBatDau: Date;
  GioKetThuc: Date;
  TinhTrangCuocHen: string;
  MaKH: string | null;
  SoDT: string | null;
}

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
    height: '50px',
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
  const [HoTen, setHoTen] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dentistNames, setDentistNames] = useState<string[]>([]);
  const [GioBatDau, setGioBatDau] = useState<Date[]>([]);
  const [GioKetThuc, setGioKetThuc] = useState<Date[]>([]);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!NgayGioKham || !LyDoKham || !HoTen) {
      setError("Vui lòng nhập đầy đủ thông tin lịch hẹn nha sĩ.");
      return;
    }

    const data = {
      NgayGioKham,
      LyDoKham,
      HoTen,
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
        setHoTen("");
        toast.success("Đăng ký lịch hẹn thành công!");
      }
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  const fetchDentists = async () => {
    try {
      const response = await axios.get<{ success: boolean; dentists: IDentist[] }>(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/get-all-dentists`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Extract names of dentists
        const names = response.data.dentists.map((dentist) => dentist.HoTen);
        setDentistNames(names);
      } else {
        console.error("Khong the lay danh sach nha si");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDentistsSchedules = async () => {
    try {
      const response = await axios.get<{ success: boolean; dentistsSchedules: IDentistSchedule[] }>(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/get-all-dentists-schedules`,
        { withCredentials: true }
      );
  
      if (response.data.success) {
        // Check if schedules array is defined before using map
        if (response.data.dentistsSchedules && Array.isArray(response.data.dentistsSchedules)) {
          // Get GioBatDau and GioKetThuc
          const startTimes = response.data.dentistsSchedules.map((schedule) => new Date(schedule.GioBatDau));
          setGioBatDau(startTimes);
  
          const endTimes = response.data.dentistsSchedules.map((schedule) => new Date(schedule.GioKetThuc));
          setGioKetThuc(endTimes);
        } else {
          console.error("Khong co lich cua nha si");
        }
      } else {
        console.error("Khong the lay lich nha si");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isAppointmentAvailable = (selectedDateTime) => {
    // Check if there is an appointment available within the selected date and time range
    const selectedDate = new Date(selectedDateTime);
    const selectedTime = selectedDate.getTime();

    return !GioBatDau.some((startTime, index) => {
      const endTime = GioKetThuc[index];
      return selectedTime >= startTime.getTime() && selectedTime <= endTime.getTime();
    });
  };

  const handleDateChange = (e) => {
    const selectedDateTime = e.target.value;

    if (isAppointmentAvailable(selectedDateTime)) {
      setNgayGioKham(selectedDateTime);
    } else {
      // Handle the case where there is already an appointment within the selected date and time range
      console.error('Đã có lịch hẹn trong khoảng thời gian này, quý khách vui lòng chọn khoảng thời gian khác.');
    }
  };

  const handleCloseError = () => {
    // Close the error popup
    setIsErrorOpen(false);
  };

  useEffect(() => {

    fetchDentists();
    fetchDentistsSchedules();
  }, []);

  useEffect(() => {
    // Set the default value to the current time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16);
    setNgayGioKham(formattedDate);
  }, []);

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.title}>Đặt lịch hẹn</div>
        <TextField
          id="LyDoKham"
          label="Lý do khám"
          type="text"
          value={LyDoKham}
          onChange={(e) => setLyDoKham(e.target.value)}
          className={classes.textField}
          multiline
          //rows={4} // Điều chỉnh số dòng hiển thị cho ô văn bản
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        <Select
          id="HoTen"
          label="Chon Nha Sĩ"
          type="text"
          value={HoTen}
          onChange={(e) => setHoTen(e.target.value)}
          className={classes.textField}
          displayEmpty
          inputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="" disabled>
            Chọn Nha Sĩ
          </MenuItem>
          {dentistNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          id="NgayGioKham"
          label="Ngày giờ khám"
          type="datetime-local"
          value={NgayGioKham}
          onChange={handleDateChange}
          className={classes.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessAlarmsIcon />
              </InputAdornment>
            ),
          }}
        />
        <Snackbar open={isErrorOpen} autoHideDuration={6000} onClose={handleCloseError}>
          <MuiAlert elevation={6} variant="filled" onClose={handleCloseError} severity="error">
            {error}
          </MuiAlert>
        </Snackbar>

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
