import { TextField } from "@mui/material";
import pictureResetPassowrd from "../images/PicResetPassword.svg";

export default function ResetPassword() {
  return (
    <div className='container py-5 h-100'>
      <div className='row d-flex align-items-center justify-content-center h-100'>
        <div className='col-md-8 col-lg-7 col-xl-6'>
          <img
            src={pictureResetPassowrd}
            className='img-fluid'
            alt='Phone image'
          />
        </div>
        <div className='col-md-7 col-lg-5 col-xl-5 offset-xl-1'>
          <h1>ĐẶT LẠI MẬT KHẨU</h1>
          <form>
            {/* Email input */}
            <TextField
              className='form-outline mb-4'
              id='standard-basic'
              label='Email'
              variant='standard'
              type='email'
            />
            {/* Submit button */}
            <button
              type='submit'
              className='btn btn-primary btn-lg btn-block'
              style={{
                backgroundColor: "#2AB178",
                borderColor: "transparent",
              }}
            >
              Đặt lại mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
