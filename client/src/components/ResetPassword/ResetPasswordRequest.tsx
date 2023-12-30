import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface ResetPasswordProps {
  onResetSuccess: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onResetSuccess }) => {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetPasswordCode, setResetPasswordCode] = useState("");
  const [openCodeForm, setOpenCodeForm] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleResetPassword = () => {
    const changePassword = {
      oldPassword: "123456",
      newPassword: newPassword,
    };

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_SERVER_PORT
        }/user/sendEmail-reset-password`,
        changePassword,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Updated successfully:", response);
        setResetToken(response.data.resetpasswordToken);
        console.log("Reset token:", response.data.resetpasswordToken);
        setOpenCodeForm(true);
      })
      .catch((error) => {
        console.error(`Error` + error);
      });
  };
  //   const resetPasswordToken = useSelector((state: any) => state.user.token);

  const handleSendCodeToChangePassword = () => {
    // console.log("Before sending reset-password API request");
    // console.log("Reset token:", resetToken);
    // console.log("Reset code:", resetPasswordCode);
    // Make API call reset the password to
    axios
      .put(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/user/reset-password`,

        {
          resetpassword_token: resetToken,
          resetpassword_code: resetPasswordCode,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setSuccess("Password reset successfully!");
        toast.success("Đổi mật khẩu thành công!"); // Show toast notification
        if (onResetSuccess) {
          onResetSuccess(); // Call the callback
        }
        handleClose();
        console.log(response);
      })
      .catch((error) => {
        setError("Password reset failed. Please try again.");
        console.error(error);
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
      <Button variant='outlined' color='primary' onClick={handleOpen}>
        Đổi mật khẩu
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
          <Typography variant='h5'>Đặt lại mật khẩu</Typography>
          <TextField
            label='Mật khẩu mới'
            type='password'
            variant='outlined'
            fullWidth
            margin='normal'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            onClick={handleResetPassword}
            sx={{ marginTop: 2 }}
          >
            Đặt lại mật khẩu
          </Button>
          <Button
            variant='outlined'
            color='error'
            onClick={handleClose}
            sx={{ marginTop: 2, marginLeft: 1 }}
          >
            Hủy
          </Button>
          <Modal open={openCodeForm} onClose={handleClose}>
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
              <Typography variant='h5'>Xác thực đặt lại mật khẩu</Typography>

              <TextField
                label='Mã đặt lại mật khẩu'
                type='text'
                variant='outlined'
                fullWidth
                margin='normal'
                value={resetPasswordCode}
                onChange={(e) => setResetPasswordCode(e.target.value)}
              />

              {error && (
                <Typography variant='body2' color='error' sx={{ marginTop: 1 }}>
                  {error}
                </Typography>
              )}

              {success && (
                <Typography
                  variant='body2'
                  color='success'
                  sx={{ marginTop: 1 }}
                >
                  {success}
                </Typography>
              )}

              <Button
                variant='contained'
                color='primary'
                onClick={handleSendCodeToChangePassword}
                sx={{ marginTop: 2 }}
              >
                Đặt lại mật khẩu ngay
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
        </Box>
      </Modal>
    </>
  );
};

export default ResetPassword;
