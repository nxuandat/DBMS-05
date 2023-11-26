require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { IEmployee } from "../models/employee.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Connection, Request as SQLRequest,TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { redis } from "../utils/redis";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendEmployeeToken,
} from "../utils/jwt";
import { getEmployeeById, getAllUsersByEmployeeService } from "../services/employee.service";

//login dentist
interface ILoginRequest {
    TenDangNhap: string;
    MatKhau: string;
}
  
export const loginEmployee = CatchAsyncError(
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

        const sql = `SELECT * FROM NHANVIEN WHERE TenDangNhap = @TenDangNhap AND MatKhau = @MatKhau`;

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
        const employee: IEmployee = {
            MaNV: columns[0].value.trim(),
            TenDangNhap: columns[1].value.trim(),
            HoTen: columns[2].value.trim(),
            Phai: columns[3].value.trim(),
            MatKhau: columns[4].value.trim(),
        };
        sendEmployeeToken(employee, 200, res);
        });

        connection.execSql(request);
    });
    } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
    }
}
);

export const logoutEmployee = CatchAsyncError(
    async (req: any, res: Response, next: NextFunction) => {
      try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
  
        const EmployeeId = req.employee?.MaNV || "";

        console.log(EmployeeId);
  
        redis.del(EmployeeId);
        
  
        res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

//get employee info
export const getEmployeeInfo = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.MaNV;
      getEmployeeById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users 
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersByEmployeeService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);