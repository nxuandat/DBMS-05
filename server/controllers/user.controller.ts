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
import { getAllUsersService, getUserById } from "../services/user.service";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendEmail";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IAppointment } from "../models/appointment.model";
import { IMedicalRecord } from "../models/medicalrecord.model";




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

            // Create the new MaKH by prepending 'KH' to the new number
            const newMaKH: string = 'KH' + newMaKHNumber.toString().padStart(2, '0');

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
              await sendMail({
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

            GRANT EXECUTE ON UpdateUserInfo TO ${MaKH}
            GRANT EXECUTE ON InsertAppointment TO ${MaKH}
            GRANT EXECUTE ON GetMedicalRecordByID TO ${MaKH}
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
          };
          sendUserToken(user, 200, res);
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

// get all users -- only for admin
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(req, res, next);
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
  HoTen?: string;
  Phai?: string;
  NgaySinh?: Date;
  DiaChi?: string;
}

//update user info
export const updateUserInfo = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { HoTen, Phai, NgaySinh, DiaChi } = req.body as IUpdateUserInfo;
      const MaKH = req.user?.MaKH;
      const password = req.user?.MatKhau;

      // Kiểm tra xem ít nhất một thuộc tính không null
      if (!HoTen && !Phai && !NgaySinh && !DiaChi) {
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
              };
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
      const { NgayGioKham, LyDoKham, MaNS } = req.body as IAppointment;
      const password = req.user?.MatKhau;
      const MaKH = req.user?.MaKH;
      const SoDT = req.user?.SoDT;

      if (!NgayGioKham && !LyDoKham && !MaNS && !MaKH && !SoDT) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin lịch hẹn nha sĩ.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaKH, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const getLastMaSoHenRequest = new SQLRequest(`SELECT MaSoHen FROM LICHHEN`, async (err: Error | null, result: any) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          let newMaSoHenNumber = result + 1;

          // Create the new MaSoHen by prepending 'MaSoHen' to the new number
          const newMaSoHen: string = 'MSH' + newMaSoHenNumber.toString().padStart(2, '0');



          getLastMaSoHenRequest.on('requestCompleted', function () {
            const sql = `InsertAppointment`;

            const insertAppointmentRequest = new SQLRequest(sql, (err, rowCount) => {
              if (err) {
                return next(new ErrorHandler(err.message, 400));
              }

              if (rowCount === 0) {
                return next(new ErrorHandler("Không thể thêm cuộc hẹn", 400));
              }
            });

            insertAppointmentRequest.addParameter('MaSoHen', TYPES.VarChar, newMaSoHen);
            insertAppointmentRequest.addParameter('NgayGioKham', TYPES.DateTime, NgayGioKham);
            insertAppointmentRequest.addParameter('LyDoKham', TYPES.NVarChar, LyDoKham);
            insertAppointmentRequest.addParameter('MaNS', TYPES.VarChar, MaNS);
            insertAppointmentRequest.addParameter('MaKH', TYPES.VarChar, MaKH);
            insertAppointmentRequest.addParameter('SoDT', TYPES.VarChar, SoDT);

            connection.callProcedure(insertAppointmentRequest);
          })

          return res.status(201).json({
            success: true,
            message: "Thêm lịch hẹn thành công"
          });

        });

        connection.execSql(getLastMaSoHenRequest);


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
