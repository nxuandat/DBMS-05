require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Connection, Request as SQLRequest,TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { redis } from "../utils/redis";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendAdminToken,
} from "../utils/jwt";
import { IAdmin } from "../models/admin.model";
import { getAdminById, getAllDentistByAdminService, getAllEmployeeService, getAllUsersService } from "../services/admin.service";
import ConnectToDataBaseWithLogin from "../utils/dblogin";

//login dentist
interface ILoginRequest {
    TenDangNhap: string;
    MatKhau: string;
}
  
export const loginAdmin = CatchAsyncError(
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

        const sql = `SELECT * FROM QUANTRIVIEN WHERE TenDangNhap = @TenDangNhap AND MatKhau = @MatKhau`;

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
        const admin: IAdmin = {
            MaQTV: columns[0].value.trim(),
            TenDangNhap: columns[1].value.trim(),
            HoTen: columns[2].value.trim(),
            Phai: columns[3].value.trim(),
            MatKhau: columns[4].value.trim(),
        };
        sendAdminToken(admin, 200, res);
        });

        connection.execSql(request);
    });
    } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
    }
}
);

//get admin info
export const getAdminInfo = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const adminId = req.admin?.MaQTV;
      getAdminById(adminId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//update admin info
interface IUpdateAdminInfo {
  HoTen?: string;
  Phai?: string;
  TenDangNhap?: string;
  MatKhau?: string;
}
export const updateAdminInfo = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { HoTen, Phai, TenDangNhap, MatKhau } = req.body as IUpdateAdminInfo;
      const MaQTV = req.admin?.MaQTV; // Assuming you have a user object with MaQTV property
      const password = req.admin?.MatKhau;

      // Check if at least one property is provided
      if (!HoTen && !Phai && !TenDangNhap && !MatKhau) {
        return next(new ErrorHandler('Vui lòng cung cấp ít nhất một thuộc tính để cập nhật.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);
      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const request = new SQLRequest('CapNhatThongTin_QuanTriVien', (err) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: err.message,
            });
          }

          // Check the output parameter to determine the result
          request.on('requestCompleted', function () {
            const sql = `SELECT * FROM QUANTRIVIEN WHERE MaQTV = @MaQTV`;

            const GetInfoAfterUpdateRequest = new SQLRequest(sql, (err, rowCount) => {
              if (err) {
                return next(new ErrorHandler(err.message, 400));
              }

              if (rowCount === 0) {
                return next(new ErrorHandler("Mã số Admin ko hợp lệ", 400));
              }
            });

            GetInfoAfterUpdateRequest.addParameter('MaQTV', TYPES.VarChar, MaQTV);

            GetInfoAfterUpdateRequest.on('row', function (columns) {
              const admin: IAdmin = {
                MaQTV: columns[0].value.trim(),
                HoTen: columns[1].value.trim(),
                Phai: columns[2].value.trim(),
                TenDangNhap: columns[3].value.trim(),
                MatKhau: columns[4].value.trim(),
              };
              //sau khi update thông tin trên sql server thì update thông tin trên redis luôn
              redis.set(MaQTV, JSON.stringify(admin));
            });

            connection.execSql(GetInfoAfterUpdateRequest);
          });

          return res.status(201).json({
            success: true,
            message: 'Thông tin admin đã được cập nhật thành công',
          });

        });

        request.addParameter('MaQTV', TYPES.Char, MaQTV);
        request.addParameter('HoTen', TYPES.NVarChar, HoTen);
        request.addParameter('Phai', TYPES.Char, Phai);
        request.addParameter('TenDangNhap', TYPES.Char, TenDangNhap);
        request.addParameter('MatKhau', TYPES.Char, MatKhau);

        connection.callProcedure(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
  

// get all users 
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all dentists
export const getAllDentistsByAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllDentistByAdminService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all employees
export const GetAllEmployee = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllEmployeeService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const logoutAdmin = CatchAsyncError(
    async (req: any, res: Response, next: NextFunction) => {
      try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
  
        const AdminId = req.admin?.MaQTV || "";

        console.log(AdminId);
  
        redis.del(AdminId);
        
  
        res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );