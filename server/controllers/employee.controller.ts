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
import ConnectToDataBaseWithLogin from "../utils/dblogin";

//login dentist
interface ILoginRequest {
    TenDangNhap: string;
    MatKhau: string;
}

interface IMedicine {
  MaThuoc: string;
  TenThuoc: string;
  DonViTinh: string;
  ChiDinh: string;
  SoLuong: number;
  NgayHetHan: Date;
  GiaThuoc: number;
}

interface IExpiredMedicine {
  MaThuoc: string;
  TenThuoc: string;
  DonViTinh: string;
  ChiDinh: string;
  SoLuong: number;
  NgayHetHan: Date;
  GiaThuoc: number;
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
      const employeeId = req.employee?.MaNV;
      getEmployeeById(employeeId, res);
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

export const addMedicineForEmployee = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.employee?.MatKhau;
      const TenDangNhap = req.employee?.TenDangNhap;
      const { MaThuoc, TenThuoc, DonViTinh, ChiDinh, SoLuong, NgayHetHan, GiaThuoc } = req.body as IMedicine;

      if (!MaThuoc || !TenThuoc || !DonViTinh || !ChiDinh || !SoLuong || !NgayHetHan || !GiaThuoc) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin để thêm thuốc.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(TenDangNhap, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const addMedicineRequest = new SQLRequest('ThemThuoc', (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể thêm thuốc", 400));
          }
        });

        addMedicineRequest.addParameter('MaThuoc', TYPES.Char, MaThuoc);
        addMedicineRequest.addParameter('TenThuoc', TYPES.NVarChar, TenThuoc);
        addMedicineRequest.addParameter('DonViTinh', TYPES.NVarChar, DonViTinh);
        addMedicineRequest.addParameter('ChiDinh', TYPES.NVarChar, ChiDinh);
        addMedicineRequest.addParameter('SoLuong', TYPES.Int, SoLuong);
        addMedicineRequest.addParameter('NgayHetHan', TYPES.Date, NgayHetHan);
        addMedicineRequest.addParameter('GiaThuoc', TYPES.BigInt, GiaThuoc);

        // Handle 'row' event
        addMedicineRequest.on('row', (columns) => {
          // Process each row if needed
          const addedMedicine: IMedicine = {
            MaThuoc: columns[0].value ? columns[0].value.trim() : null,
            TenThuoc: columns[1].value ? columns[1].value.trim() : null,
            DonViTinh: columns[2].value ? columns[2].value.trim() : null,
            ChiDinh: columns[3].value ? columns[3].value.trim() : null,
            SoLuong: columns[4].value,
            NgayHetHan: columns[5].value ? columns[5].value : null,
            GiaThuoc: columns[6].value,
          };

          // Respond with the processed data
          res.status(201).json({
            success: true,
            addedMedicine,
          });
        });

        connection.execSql(addMedicineRequest);
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//delete medicine
export const deleteMedicineForEmployee = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.employee?.MatKhau;
      const TenDangNhap = req.employee?.TenDangNhap;

      const { MaThuoc } = req.params; // Assuming MaThuoc is part of the request parameters

      if (!MaThuoc) {
        return next(new ErrorHandler('Vui lòng cung cấp mã thuốc để xóa.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(TenDangNhap, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const deleteMedicineRequest = new SQLRequest('XoaThuoc', (err) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          return res.status(200).json({
            success: true,
            message: 'Xóa thuốc thành công',
          });
        });

        deleteMedicineRequest.addParameter('MaThuoc', TYPES.Char, MaThuoc);

        connection.execSql(deleteMedicineRequest);
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdatedMedicine {
  TenThuoc: string;
  DonViTinh: string;
  ChiDinh: string;
  SoLuong: number;
  NgayHetHan: Date;
  GiaThuoc: number;
}

export const updateMedicineForEmployee = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.employee?.MatKhau;
      const TenDangNhap = req.employee?.TenDangNhap;
      const { MaThuoc } = req.params; // Assuming MaThuoc is part of the request parameters
      const { TenThuoc, DonViTinh, ChiDinh, SoLuong, NgayHetHan, GiaThuoc } = req.body as IUpdatedMedicine;

      if (!MaThuoc || !TenThuoc || !DonViTinh || !ChiDinh || !SoLuong || !NgayHetHan || !GiaThuoc) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin để cập nhật thuốc.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(TenDangNhap, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const updateMedicineRequest = new SQLRequest('SuaThongTinThuoc', (err) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          // Handle 'row' event
          updateMedicineRequest.on('row', (columns) => {
            // Process each row if needed
            const updatedMedicine: IUpdatedMedicine = {
              TenThuoc: columns[0].value ? columns[0].value.trim() : null,
              DonViTinh: columns[1].value ? columns[1].value.trim() : null,
              ChiDinh: columns[2].value ? columns[2].value.trim() : null,
              SoLuong: columns[3].value,
              NgayHetHan: columns[4].value ? columns[4].value : null,
              GiaThuoc: columns[5].value,
            };

            // Respond with the processed data
            res.status(200).json({
              success: true,
              updatedMedicine,
            });
          });

          connection.execSql(updateMedicineRequest);
        });

        updateMedicineRequest.addParameter('MaThuoc', TYPES.Char, MaThuoc);
        updateMedicineRequest.addParameter('TenThuoc', TYPES.NVarChar, TenThuoc);
        updateMedicineRequest.addParameter('DonViTinh', TYPES.NVarChar, DonViTinh);
        updateMedicineRequest.addParameter('ChiDinh', TYPES.NVarChar, ChiDinh);
        updateMedicineRequest.addParameter('SoLuong', TYPES.Int, SoLuong);
        updateMedicineRequest.addParameter('NgayHetHan', TYPES.Date, NgayHetHan);
        updateMedicineRequest.addParameter('GiaThuoc', TYPES.BigInt, GiaThuoc);
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getMedicineForEmployee = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.employee?.MatKhau;
      const TenDangNhap = req.employee?.TenDangNhap;
      const { MaThuoc } = req.params; // Assuming MaThuoc is part of the request parameters

      if (!MaThuoc) {
        return next(new ErrorHandler('Vui lòng cung cấp mã thuốc để xem thông tin.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(TenDangNhap, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const getMedicineInfoRequest = new SQLRequest('XemThuoc', (err) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }
        });

        getMedicineInfoRequest.addParameter('MaThuoc', TYPES.Char, MaThuoc);

        // Handle 'row' event
        getMedicineInfoRequest.on('row', (columns) => {
          // Process each row if needed
          const medicineInfo: IMedicine = {
            MaThuoc: columns[0].value ? columns[0].value.trim() : null,
            TenThuoc: columns[1].value ? columns[1].value.trim() : null,
            DonViTinh: columns[2].value ? columns[2].value.trim() : null,
            ChiDinh: columns[3].value ? columns[3].value.trim() : null,
            SoLuong: columns[4].value,
            NgayHetHan: columns[5].value ? columns[5].value : null,
            GiaThuoc: columns[6].value,
          };

          // Respond with the processed data
          res.status(200).json({
            success: true,
            medicineInfo,
          });
        });

        connection.execSql(getMedicineInfoRequest);
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getExpiredMedicineForEmployee = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const password = req.employee?.MatKhau;
      const TenDangNhap = req.employee?.TenDangNhap;
      const connection: Connection = ConnectToDataBaseWithLogin(TenDangNhap, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const getExpiredMedicinesRequest = new SQLRequest('XemThuocHetHan', (err) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }
        });

        // Handle 'row' event
        const expiredMedicines: IExpiredMedicine[] = [];

        getExpiredMedicinesRequest.on('row', (columns) => {
          // Process each row
          const expiredMedicine: IExpiredMedicine = {
            MaThuoc: columns[0].value ? columns[0].value.trim() : null,
            TenThuoc: columns[1].value ? columns[1].value.trim() : null,
            DonViTinh: columns[2].value ? columns[2].value.trim() : null,
            ChiDinh: columns[3].value ? columns[3].value.trim() : null,
            SoLuong: columns[4].value,
            NgayHetHan: columns[5].value ? columns[5].value : null,
            GiaThuoc: columns[6].value,
          };

          // Check if the medicine is expired
          if (expiredMedicine.NgayHetHan && expiredMedicine.NgayHetHan < new Date()) {
            expiredMedicines.push(expiredMedicine);
          }
        });

        // Respond with the processed data
        getExpiredMedicinesRequest.on('requestCompleted', () => {
          res.status(200).json({
            success: true,
            expiredMedicines,
          });
        });

        connection.execSql(getExpiredMedicinesRequest);
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


