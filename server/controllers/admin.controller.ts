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
import { getAdminById, getAllDentistByAdminService, getAllEmployeeService, getAllRevenueService, getAllUsersService } from "../services/admin.service";
import { generateLast12MonthsDataAppointment, generateLast12MonthsDataInvoice, generateLast12MonthsDataUser } from "../utils/analytics.generator";

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

// get users analytics --- only for admin
export const getUsersAnalytics = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      const users = await generateLast12MonthsDataUser(MaQTV,password);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get invoices analytics --- only for admin
export const getInvoicesAnalytics = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      const invoices = await generateLast12MonthsDataInvoice(MaQTV,password);

      res.status(200).json({
        success: true,
        invoices,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get appointments analytics --- only for admin
export const getAppointmentsAnalytics = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      const appointments = await generateLast12MonthsDataAppointment(MaQTV,password);

      res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get revenue every month
export const getAllRevenue = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllRevenueService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//logout admin
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

