require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { IUser } from "../models/user.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBaseDefault from '../utils/db';
import { redis } from "../utils/redis";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendUserToken,
} from "../utils/jwt";
import { getAllDentistByUserService, getAllDentistsScheduleByUserService, getUserById } from "../services/user.service";
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/sendEmail";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IAppointment } from "../models/appointment.model";
import { IMedicalRecord } from "../models/medicalrecord.model";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import cloudinary from "cloudinary";
import { IDentist } from "../models/dentist.model";
import { IDetailMedicine } from "../models/detailmedicine.model";




interface IRegistrationBody {
  MaKH: string;
  SoDT: string;
  HoTen: string;
  Phai: string;
  NgaySinh: Date;
  DiaChi: string;
  MatKhau: string;
  Email: string;
}

//register user
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email } = req.body;

      const connection: Connection = ConnectToDataBaseDefault();
      connection.on('connect', (err: Error | null) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sqlRequest = new SQLRequest(`SELECT * FROM KHACHHANG WHERE SoDT = '${SoDT}'`, async (err: Error | null, rowCount: number) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount > 0) {
            return next(new ErrorHandler("Số điện thoại đã tồn tại.", 400));
          }

          // Get the last MaKH from the KHACHHANG table
          const getLastMaKHRequest = new SQLRequest(`SELECT MaKH FROM KHACHHANG`, async (err: Error | null, result: any) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            let newMaKHNumber;

            newMaKHNumber = result + 1;

            const randomNumber = Math.floor(Math.random() * 1000) + 1;

            // Create the new MaKH by prepending 'KH' to the new number
            const newMaKH: string = 'KH' + randomNumber.toString().padStart(2, '0');

            const user: IRegistrationBody = {
              MaKH: newMaKH,
              SoDT,
              HoTen,
              Phai,
              NgaySinh,
              DiaChi,
              MatKhau,
              Email
            };
            const activationToken = createActivationToken(user);

            const activationCode = activationToken.activationCode;

            const data = { user: { name: user.HoTen }, activationCode };

            const html = await ejs.renderFile(
              path.join(__dirname, "../mails/activation-mail.ejs"),
              data
            );

            try {
              // await sendPhoneNumber({
              //   phoneNumber: user.SoDT,
              //   data,
              // });
              await sendEmail({
                email: user.Email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
              });

              res.status(201).json({
                success: true,
                activationCode,
                activationToken: activationToken.token,
              });
            } catch (error: any) {
              console.error(`Failed to send SMS in registrationUser function: ${error.message}`);
              return next(new ErrorHandler(error.message, 400));
            }
          });

          // Execute the getLastMaKHRequest
          connection.execSql(getLastMaKHRequest);
        });

        connection.execSql(sqlRequest);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//create activation token
interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  console.log(token);
  return { token, activationCode };
};


//create account after verification email successfully
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IRegistrationBody; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IRegistrationBody; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email } = newUser.user;

      // Connect to the database
      const connection: Connection = ConnectToDataBaseDefault();

      connection.on('connect', async (err: Error | null) => {
        if (err) {
          console.error(`Connection error: ${err.message}`);
          return next(new ErrorHandler(err.message, 400));
        } else {
          console.log('Connected to Microsoft SQL Server ');

          // Create a new request
          const request = new SQLRequest(`SELECT 1 FROM KHACHHANG WHERE SoDT = '${SoDT}'`, (err) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }
          });

          let existUser = false;

          // Listen for the 'row' event, which is emitted for each row in the result set
          request.on('row', () => {
            existUser = true;
          });

          // Listen for the 'requestCompleted' event
          request.on('requestCompleted', () => {
            if (existUser) {
              return next(new ErrorHandler("SoDT already exist", 400));
            }

            // Insert the new user into the database using stored procedure
            const InsertandPermissionRequest = new SQLRequest(`EXEC DangKyTaiKhoan '${MaKH}', '${SoDT}', N'${HoTen}', '${Phai}', '${NgaySinh}', N'${DiaChi}', '${MatKhau}', '${Email}'
            
            CREATE LOGIN ${MaKH}
            WITH PASSWORD = '${MatKhau}',
            CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
            DEFAULT_DATABASE = PHONGKHAMNHASI

            CREATE USER ${MaKH}
            for login ${MaKH}
            
            GRANT SELECT, UPDATE 
            ON KHACHHANG TO ${MaKH}
            
            GRANT SELECT, UPDATE
            ON LICHHEN TO ${MaKH}

            GRANT SELECT, UPDATE, INSERT
            ON LICHHEN TO ${MaKH}

            GRANT SELECT
            ON NHASI TO ${MaKH}
            
            GRANT SELECT
            ON HOSOBENH TO ${MaKH}

            GRANT SELECT,DELETE,UPDATE,INSERT
            ON LUUTRUANH TO ${MaKH}

            GRANT SELECT,UPDATE 
            ON HOADON TO ${MaKH}

            GRANT EXECUTE ON UpdateUserInfo TO ${MaKH}
            GRANT EXECUTE ON InsertAppointment TO ${MaKH}
            GRANT EXECUTE ON GetMedicalRecordByID TO ${MaKH}
            GRANT EXECUTE ON GetAllDentistInfoByUser TO ${MaKH}
            GRANT EXECUTE ON GetAllLICHNHASI TO ${MaKH}
            GRANT EXECUTE ON UpdatePasswordByUser TO ${MaKH}
            GRANT EXECUTE ON UpdateProfilePicture TO ${MaKH}
            GRANT EXECUTE ON getDoctorDetailsByUser TO ${MaKH}
            GRANT EXECUTE ON getAppointmentByUser TO ${MaKH}
            GRANT EXECUTE ON GetAllLoaiDichVu TO ${MaKH}
            GRANT EXECUTE ON GetDetailMedicineByUser TO ${MaKH}
            `, (err) => {
              if (err) {
                return next(new ErrorHandler(err.message, 400));
              }
              const notification: string = "create account successfully"
              res.status(201).json({
                success: true,
                notification
              });
            });

            // Execute the insert request
            connection.execSql(InsertandPermissionRequest);


          });

          // Execute the request
          connection.execSql(request);
        }
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//login user
interface ILoginRequest {
  SoDT: string;
  MatKhau: string;
}

export const loginUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { SoDT, MatKhau } = req.body as ILoginRequest;

      if (!SoDT || !MatKhau) {
        return next(new ErrorHandler("Vui lòng nhập số điện thoại và mật khẩu", 400));
      }

      const connection: Connection = ConnectToDataBaseDefault();
      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `SELECT * FROM KHACHHANG WHERE SoDT = @SoDT AND MatKhau = @MatKhau`;

        const request = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Số điện thoại hoặc mật khẩu không hợp lệ", 400));
          }
        });

        request.addParameter('SoDT', TYPES.VarChar, SoDT);
        request.addParameter('MatKhau', TYPES.VarChar, MatKhau);

        request.on('row', function (columns) {
          const user: IUser = {
            MaKH: columns[0].value.trim(),
            SoDT: columns[1].value.trim(),
            HoTen: columns[2].value.trim(),
            Phai: columns[3].value.trim(),
            NgaySinh: new Date(columns[4].value),
            DiaChi: columns[5].value.trim(),
            MatKhau: columns[6].value.trim(),
            Email: columns[7].value.trim(),
            NgayTao: new Date(columns[8].value)
          };
          sendUserToken(req,user, 200, res);
        });

        connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const logoutUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      const userId = req.user?.MaKH || "";

      redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);



//get user info
export const getUserInfo = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.MaKH;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdateUserInfo {
  SoDT?:string;
  HoTen?: string;
  Phai?: string;
  NgaySinh?: Date;
  DiaChi?: string;
  Email?:string;
}

//update user info
export const updateUserInfo = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { SoDT ,HoTen, Phai, NgaySinh, DiaChi, Email } = req.body as IUpdateUserInfo;
      const MaKH = req.user?.MaKH;
      const password = req.user?.MatKhau;

      // Kiểm tra xem ít nhất một thuộc tính không null
      if (!SoDT && !HoTen && !Phai && !NgaySinh && !DiaChi && !Email) {
        return next(new ErrorHandler('Vui lòng cung cấp ít nhất một thuộc tính để cập nhật.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaKH, password);
      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const request = new SQLRequest('UpdateUserInfo', (err) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: err.message,
            });

          }

          request.on('requestCompleted', function () {
            const sql = `SELECT * FROM KHACHHANG WHERE MaKH = @MaKH`;

            const GetInfoAfterUpdateRequest = new SQLRequest(sql, (err, rowCount) => {
              if (err) {
                return next(new ErrorHandler(err.message, 400));
              }

              if (rowCount === 0) {
                return next(new ErrorHandler("Mã số khách hàng ko hợp lệ", 400));
              }
            });

            GetInfoAfterUpdateRequest.addParameter('MaKH', TYPES.VarChar, MaKH);

            GetInfoAfterUpdateRequest.on('row', function (columns) {
              const user: IUser = {
                MaKH: columns[0].value.trim(),
                SoDT: columns[1].value.trim(),
                HoTen: columns[2].value.trim(),
                Phai: columns[3].value.trim(),
                NgaySinh: new Date(columns[4].value),
                DiaChi: columns[5].value.trim(),
                MatKhau: columns[6].value.trim(),
                Email: columns[7].value.trim(),
                NgayTao: new Date(columns[8].value)
              };
              //sau khi update thông tin trên sql server thì update thông tin trên redis luôn
              redis.set(MaKH, JSON.stringify(user));
            });

            connection.execSql(GetInfoAfterUpdateRequest);
          });

          return res.status(201).json({
            success: true,
            message: 'Thông tin người dùng đã được cập nhật thành công',
          });

        });

        request.addParameter('HoTen', TYPES.NVarChar, HoTen);
        request.addParameter('Phai', TYPES.Char, Phai);
        request.addParameter('NgaySinh', TYPES.DateTime, NgaySinh);
        request.addParameter('DiaChi', TYPES.NVarChar, DiaChi);
        request.addParameter('MaKH', TYPES.Char, MaKH);
        request.addParameter('SoDT', TYPES.Char, SoDT);
        request.addParameter('Email', TYPES.VarChar, Email);

        connection.callProcedure(request);

      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// create appointment to dentist
export const createAppointment = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { NgayGioKham, LyDoKham, HoTen } = req.body as any;
      const password = req.user?.MatKhau;
      const MaKH = req.user?.MaKH;
      const SoDT = req.user?.SoDT;

      if (!NgayGioKham && !LyDoKham && !HoTen && !MaKH && !SoDT) {
        return next(
          new ErrorHandler(
            "Vui lòng nhập đầy đủ thông tin lịch hẹn nha sĩ.",
            400
          )
        );
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaKH, password);

      connection.on("connect", (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const randomNumber = Math.floor(Math.random() * 1000) + 1;

        // Create the new MaSoHen by prepending 'MaSoHen' to the new number
        const newMaSoHen: string =
          "MSH" + randomNumber.toString().padStart(2, "0");

        const sql = `InsertAppointment`;

        const insertAppointmentRequest = new SQLRequest(
          sql,
          (err, rowCount) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            if (rowCount === 0) {
              return next(new ErrorHandler("Không thể thêm cuộc hẹn", 400));
            }
            return res.status(201).json({
              success: true,
              message: "Thêm lịch hẹn thành công",
            });
          }
        );
        console.log(NgayGioKham);

        insertAppointmentRequest.addParameter(
          "MaSoHen",
          TYPES.VarChar,
          newMaSoHen
        );
        insertAppointmentRequest.addParameter(
          "NgayGioKham",
          TYPES.DateTime,
          NgayGioKham
        );
        insertAppointmentRequest.addParameter(
          "LyDoKham",
          TYPES.NVarChar,
          LyDoKham
        );
        insertAppointmentRequest.addParameter("HoTen", TYPES.NVarChar, HoTen);
        insertAppointmentRequest.addParameter("MaKH", TYPES.VarChar, MaKH);
        insertAppointmentRequest.addParameter("SoDT", TYPES.VarChar, SoDT);

        connection.callProcedure(insertAppointmentRequest);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// view medical record 
export const getMedicalRecordByUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.user?.MatKhau;
      const MaKH = req.user?.MaKH;

      const connection: Connection = ConnectToDataBaseWithLogin(MaKH, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC GetMedicalRecordByID @MaKH`;

        const request = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không tìm thấy hồ sơ y tế cho mã khách hàng này", 400));
          }
        });

        request.addParameter('MaKH', TYPES.Char, MaKH);

        request.on('row', function (columns) {
          const medicalRecord: IMedicalRecord = {
            MaKH: columns[0].value ? columns[0].value.trim() : null,
            SoDT: columns[1].value ? columns[1].value.trim() : null,
            STT: columns[2].value,
            NgayKham: new Date(columns[3].value),
            DanDo: columns[4].value ? columns[4].value.trim() : null,
            MaNS: columns[5].value ? columns[5].value.trim() : null,
            MaDV: columns[6].value ? columns[6].value.trim() : null,
            MaThuoc: columns[7].value ? columns[7].value.trim() : null,
            TinhTrangXuatHoaDon: columns[8].value ? columns[8].value.trim() : null,
          };
          res.status(200).json({
            success: true,
            medicalRecord
          });
        });

        connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Get all dentist
export const getAllDentistsByUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      getAllDentistByUserService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Get All Dentist Schedule
export const getAllDentistsScheduleByUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      getAllDentistsScheduleByUserService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//create reset password token and code
interface IResetpasswordToken {
  token: string;
  resetPasswordCode: string;
}

export const createResetpasswordToken = (userOldAndNewPassword: any): IResetpasswordToken => {
  const resetPasswordCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      userOldAndNewPassword,
      resetPasswordCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "10m",
    }
  );
  return { token, resetPasswordCode };
};

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const sendResetPasswordEmail = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const HoTen = req.user?.HoTen;
      const email = req.user?.Email;
      const userOldAndNewPassword: IUpdatePassword = {
        oldPassword,
        newPassword
      };
      const resetPasswordToken = createResetpasswordToken(userOldAndNewPassword);

      const resetPasswordCode = resetPasswordToken.resetPasswordCode;

      const data = { user: { name: HoTen }, resetPasswordCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/resetpassword-mail.ejs"),
        data
      );

      try {
        await sendEmail({
          email: email,
          subject: "Reset your password account",
          template: "resetpassword-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          resetPasswordCode,
          resetpasswordToken: resetPasswordToken.token,
        });
      } catch (error: any) {
        console.error(`Failed to send SMS in registrationUser function: ${error.message}`);
        return next(new ErrorHandler(error.message, 400));
      }

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//reset password after verification email successfully
interface IResetPassowrdRequest {
  resetpassword_token: string;
  resetpassword_code: string;
}

export const ResetPasswordByUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const MaKH = req.user?.MaKH;
      const MatKhau = req.user?.MatKhau;
      const SoDT = req.user?.SoDT;
      const { resetpassword_token, resetpassword_code } =
        req.body as IResetPassowrdRequest;
      const updatePassword: { userOldAndNewPassword: IUpdatePassword; resetPasswordCode: string } = jwt.verify(
        resetpassword_token,
        process.env.ACTIVATION_SECRET as string
      ) as { userOldAndNewPassword: IUpdatePassword; resetPasswordCode: string };

      if (updatePassword.resetPasswordCode !== resetpassword_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { oldPassword,newPassword } = updatePassword.userOldAndNewPassword;
      const connection: Connection = ConnectToDataBaseDefault();

      connection.on('connect', async (err: Error | null) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        } 

        const request = new SQLRequest('UpdatePasswordByUser', (err) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: err.message,
            });

          }

          request.on('requestCompleted', function () {
            const sql = `
            SELECT * FROM KHACHHANG WHERE MaKH = @MaKH
            ALTER LOGIN ${MaKH} WITH PASSWORD = '${newPassword}';
            `;

            const GetInfoAfterUpdateRequest = new SQLRequest(sql, (err, rowCount) => {
              if (err) {
                return next(new ErrorHandler(err.message, 400));
              }

              if (rowCount === 0) {
                return next(new ErrorHandler("Mã số khách hàng ko hợp lệ", 400));
              }
            });

            GetInfoAfterUpdateRequest.addParameter('MaKH', TYPES.VarChar, MaKH);
      
            


            GetInfoAfterUpdateRequest.on('row', function (columns) {
              const user: IUser = {
                MaKH: columns[0].value.trim(),
                SoDT: columns[1].value.trim(),
                HoTen: columns[2].value.trim(),
                Phai: columns[3].value.trim(),
                NgaySinh: new Date(columns[4].value),
                DiaChi: columns[5].value.trim(),
                MatKhau: columns[6].value.trim(),
                Email: columns[7].value.trim(),
                NgayTao: new Date(columns[8].value)
              };
              //sau khi update thông tin trên sql server thì update thông tin trên redis luôn
              redis.set(MaKH, JSON.stringify(user));
            });

            connection.execSql(GetInfoAfterUpdateRequest);
          });

          return res.status(201).json({
            success: true,
            message: 'Mật khẩu người dùng đã được cập nhật thành công',
          });

        });

        request.addParameter('MaKH', TYPES.Char, MaKH);
        request.addParameter('SoDT', TYPES.Char, SoDT);
        request.addParameter('newPassword', TYPES.Char, newPassword);


        connection.callProcedure(request);
         
      });

     

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Update User Avatar Picture
export const updateProfilePictureUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;
      const MaKH = req.user?.MaKH;
      const password = req.user?.MatKhau;
      const SoDT = req.user?.SoDT;

      const connection: Connection = ConnectToDataBaseWithLogin(MaKH, password);

      connection.on('connect', async (err: Error | null) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const request = new SQLRequest(`SELECT AvatarUrl FROM LUUTRUANH WHERE MaNguoiDung = @MaKH`, (err) => {
          if (err) {
            throw new ErrorHandler(err.message, 400);
          }
        });

        request.addParameter('MaKH', TYPES.Char, MaKH);

        let userAvatar: any;

        request.on('row', (columns) => {
          userAvatar = columns[0].value;
        });

        request.on('requestCompleted', async function () {
          if (avatar && userAvatar) {
            // first delete the old image
            await cloudinary.v2.uploader.destroy(userAvatar);

            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });

            userAvatar = myCloud.secure_url;
          } else {
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });

            userAvatar = myCloud.secure_url;
          }

          const updateRequest = new SQLRequest(`EXEC UpdateProfilePicture @MaKH, @SoDT, @AvatarUrl`, (err) => {
            if (err) {
              throw new ErrorHandler(err.message, 400);
            }
          });

          updateRequest.addParameter('MaKH', TYPES.Char, MaKH);
          updateRequest.addParameter('SoDT', TYPES.Char, SoDT);
          updateRequest.addParameter('AvatarUrl', TYPES.VarChar, userAvatar);

          connection.execSql(updateRequest);

          updateRequest.on('requestCompleted', function () {
            res.status(200).json({
              success: true,
              user: {
                MaNguoiDung: MaKH,
                AvatarUrl: userAvatar
              },
            });
          });
        });

        connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Get Avatar Url By User
export const getProfilePictureUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const MaKH = req.user?.MaKH;
      const password = req.user?.MatKhau;

      const connection: Connection = ConnectToDataBaseWithLogin(MaKH, password);

      connection.on('connect', async (err: Error | null) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const request = new SQLRequest(`SELECT AvatarUrl FROM LUUTRUANH WHERE MaNguoiDung = @MaKH`, (err) => {
          if (err) {
            throw new ErrorHandler(err.message, 400);
          }
        });

        request.addParameter('MaKH', TYPES.Char, MaKH);

        let userAvatar: any;

        request.on('row', (columns) => {
          userAvatar = columns[0].value;
        });

        request.on('requestCompleted', function () {
          res.status(200).json({
            success: true,
            user: {
              MaNguoiDung: MaKH,
              AvatarUrl: userAvatar
            },
          });
        });

        connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//  send stripe publishble key
export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// create new payment by user
export const newPaymentByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        // payment_method_types: ["card"],
        metadata: {
          company: "Dentist Clinic",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//complete payment by user

//get doctor details by user
export const getDoctorDetailsByUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const MaNS = req.params.id;

      const connection: Connection = ConnectToDataBaseDefault();

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC getDoctorDetailsByUser @MaNS`;

        const request = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không tìm thấy thông tin bác sĩ cho mã này", 400));
          }
        });

        request.addParameter('MaNS', TYPES.Char, MaNS);

        request.on('row', function (columns) {
          const doctorDetails: IDentist = {
            MaNS: columns[0].value ? columns[0].value.trim() : null,
            TenDangNhap: "none",
            HoTen: columns[2].value ? columns[2].value.trim() : null,
            Phai: columns[3].value ? columns[3].value.trim() : null,
            GioiThieu: columns[4].value ? columns[4].value.trim() : null,
            MatKhau: "none",
          };
          res.status(200).json({
            success: true,
            doctorDetails
          });
        });

        connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get appointment by user id
export const getAppointmentByUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.user?.MatKhau;
      const MaKH = req.user?.MaKH;

      const connection: Connection = ConnectToDataBaseWithLogin(MaKH, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC getAppointmentByUser @MaKH`;

        const request = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không tìm thấy lịch hẹn cho mã khách hàng này", 400));
          }
        });

        request.addParameter('MaKH', TYPES.Char, MaKH);

        let appointments: IAppointment[] = [];

        request.on('row', function (columns) {
          const appointment: IAppointment = {
            MaSoHen: columns[0].value ? columns[0].value.trim() : null,
            NgayGioKham: new Date(columns[1].value),
            LyDoKham: columns[2].value ? columns[2].value.trim() : null,
            MaNS: columns[3].value ? columns[3].value.trim() : null,
            MaKH: columns[4].value ? columns[4].value.trim() : null,
            SoDT: columns[5].value ? columns[5].value.trim() : null
          };
          appointments.push(appointment);
          
        });

        request.on('requestCompleted', function () {
          res.status(200).json({
            success: true,
            appointments,
          });
      });

        connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getDetailMedicineByUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.user?.MatKhau;
      const MaKH = req.user?.MaKH;

      const connection: Connection = ConnectToDataBaseWithLogin(MaKH, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC GetDetailMedicineByUser @MaKH`;

        const request = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không tìm thấy chi tiết thuốc cho mã khách hàng này", 400));
          }
          request.on('requestCompleted', function () {
            res.status(200).json({
              success: true,
              medicines,
            });
          });
        });

        request.addParameter('MaKH', TYPES.Char, MaKH);

        let medicines :IDetailMedicine[] = [];

        request.on('row', function (columns) {
          const medicine = {
            MaThuoc: columns[0].value.trim(),
            MaKH: columns[1].value.trim(),
            STT: columns[3].value,
            SoDT: columns[2].value.trim(),
            SoLuong: columns[4].value,
            ThoiDiemDung: columns[5].value.trim(),
          };
          medicines.push(medicine);
        });

       

        connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);




