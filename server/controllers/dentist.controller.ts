require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { IDentist } from "../models/dentist.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Connection, Request as SQLRequest,TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { redis } from "../utils/redis";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendDentistToken,
} from "../utils/jwt";
import { getDentistById } from "../services/dentist.service";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IMedicalRecord } from "../models/medicalrecord.model";

//login dentist
interface ILoginRequest {
    TenDangNhap: string;
    MatKhau: string;
}
interface ISchedule {
  MaNS: string;
  STT: number;
  GioBatDau: string;
  GioKetThuc: string;
  TinhTrangCuocHen: string;
}
  
export const loginDentist = CatchAsyncError(
async (req: any, res: Response, next: NextFunction) => {
    try {
    const { TenDangNhap, MatKhau } = req.body as ILoginRequest;

    if (!TenDangNhap || !MatKhau) {
        return next(new ErrorHandler("Vui lòng nhập tên đăng nhập và mật khẩu", 400));
    }

    const connection: Connection = ConnectToDataBase();
    connection.on('connect', (err) => {
        if (err) {
        return next(new ErrorHandler(err.message, 400));
        }

        const sql = `SELECT * FROM NHASI WHERE TenDangNhap = @TenDangNhap AND MatKhau = @MatKhau`;

        const request = new SQLRequest(sql, (err, rowCount) => {
        if (err) {
            return next(new ErrorHandler(err.message, 400));
        }

        if (rowCount === 0) {
            return next(new ErrorHandler("Tên đăng nhập hoặc mật khẩu không hợp lệ", 400));
        }
        });

        request.addParameter('TenDangNhap', TYPES.VarChar, TenDangNhap);
        request.addParameter('MatKhau', TYPES.VarChar, MatKhau);

        request.on('row', function(columns) {
        const dentist: IDentist = {
            MaNS: columns[0].value.trim(),
            TenDangNhap: columns[1].value.trim(),
            HoTen: columns[2].value.trim(),
            Phai: columns[3].value.trim(),
            GioiThieu: columns[4].value.trim(),
            MatKhau: columns[5].value.trim(),
        };
        sendDentistToken(dentist, 200, res);
        });

        connection.execSql(request);
    });
    } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
    }
}
);

export const logoutDentist = CatchAsyncError(
    async (req: any, res: Response, next: NextFunction) => {
      try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
  
        const DentistId = req.dentist?.MaNS || "";

        console.log(DentistId);
  
        redis.del(DentistId);
        
  
        res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

//get dentist info
export const getDentistInfo = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const dentistId = req.dentist?.MaNS;
      getDentistById(dentistId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getMedicalRecordByDentist = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.dentist?.MatKhau;
      const MaNS = req.dentist?.MaNS;
      const MaKH = req.params.MaKH; // Assuming MaKH is part of the request parameters

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

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
            return next(new ErrorHandler("Không tìm thấy hồ sơ y tế cho mã khách hàng này", 404));
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
            medicalRecord,
          });
        });

        connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get schedule for dentist
export const getScheduleForDentist = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.dentist?.MatKhau;
      const MaNS = req.dentist?.MaNS;

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', async (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC XemLichNhaSi @MaNS`;
        const request = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không tìm thấy lich nha si cho mã nha si này", 404));
          }
        });

        request.addParameter('MaNS', TYPES.Char, MaNS);

        request.on('row', function (columns) {
          const schedule: ISchedule = {
            MaNS: columns[0].value ? columns[0].value.trim() : null,
            STT: columns[1].value,
            GioBatDau: columns[2].value ? columns[2].value.trim() : null,
            GioKetThuc: columns[3].value ? columns[3].value.trim() : null,
            TinhTrangCuocHen: columns[4].value ? columns[4].value.trim() : null,
          };

          res.status(200).json({
            success: true,
            schedule,
          });
        });

        request.on('done', function () {
          connection.close(); // Close the connection after processing
        });

        await connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Create schedule for dentist
export const createScheduleDentist = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { GioBatDau, GioKetThuc, TinhTrangCuocHen } = req.body as ISchedule;
      const password = req.dentist?.MatKhau;
      const MaNS = req.dentist?.MaNS;

      if (!GioBatDau || !GioKetThuc || !TinhTrangCuocHen || !MaNS) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin lịch hẹn nha sĩ.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const insertScheduleRequest = new SQLRequest('ThemLichHenNhaSi', (err) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          return res.status(201).json({
            success: true,
            message: 'Thêm lịch hẹn nha sĩ thành công',
          });
        });

        insertScheduleRequest.addParameter('MaNS', TYPES.Char, MaNS);
        insertScheduleRequest.addParameter('GioBatDau', TYPES.DateTime, GioBatDau);
        insertScheduleRequest.addParameter('GioKetThuc', TYPES.DateTime, GioKetThuc);
        insertScheduleRequest.addParameter('TinhTrangCuocHen', TYPES.Char, TinhTrangCuocHen);

        // Handle 'row' event
        insertScheduleRequest.on('row', (columns) => {
          // Process each row if needed
          const schedule: ISchedule = {
            MaNS: columns[0].value ? columns[0].value.trim() : null,
            STT: columns[1].value,
            GioBatDau: columns[2].value ? columns[2].value.trim() : null,
            GioKetThuc: columns[3].value ? columns[3].value.trim() : null,
            TinhTrangCuocHen: columns[4].value ? columns[4].value.trim() : null,
          };

          // Respond with the processed data
          res.status(200).json({
            success: true,
            schedule,
          });
        });

        connection.execSql(insertScheduleRequest);
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Delete schedule for dentist
export const deleteScheduleDentist = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { STT } = req.body as ISchedule;
      const password = req.dentist?.MatKhau;
      const MaNS = req.dentist?.MaNS;

      if (!STT || !MaNS) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin lịch hẹn nha sĩ.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const deleteScheduleRequest = new SQLRequest('XoaLichHenNhaSi', (err) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          return res.status(201).json({
            success: true,
            message: 'Xóa lịch hẹn nha sĩ thành công',
          });
        });

        deleteScheduleRequest.addParameter('MaNS', TYPES.Char, MaNS);
        deleteScheduleRequest.addParameter('STT', TYPES.Int, STT);

        connection.execSql(deleteScheduleRequest);
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

