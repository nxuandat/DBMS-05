require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { IEmployee } from "../models/employee.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Connection, Request as SQLRequest, TYPES } from "tedious";
import ConnectToDataBase from "../utils/db";
import { redis } from "../utils/redis";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendEmployeeToken,
} from "../utils/jwt";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import {
  getAllAppointmentsService,
  getAllDentistByEmployeeService,
  getAllInvoicesService,
  getAllUsersService,
  getEmployeeById,
} from "../services/employee.service";
import { getAllServicesDentalClinicServiceByUser } from "../services/user.service";

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
        return next(
          new ErrorHandler("Vui lòng nhập tên đăng nhập và mật khẩu", 400)
        );
      }

      const connection: Connection = ConnectToDataBase();
      connection.on("connect", (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `SELECT * FROM NHANVIEN WHERE TenDangNhap = @TenDangNhap AND MatKhau = @MatKhau`;

        const request = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(
              new ErrorHandler("Tên đăng nhập hoặc mật khẩu không hợp lệ", 400)
            );
          }
        });

        request.addParameter("TenDangNhap", TYPES.VarChar, TenDangNhap);
        request.addParameter("MatKhau", TYPES.VarChar, MatKhau);

        request.on("row", function (columns) {
          const employee: IEmployee = {
            MaNV: columns[0].value.trim(),
            HoTen: columns[1].value.trim(),
            Phai: columns[2].value.trim(),
            TenDangNhap: columns[3].value.trim(),
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

export const createAppointmentByEmployee = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { NgayGioKham, LyDoKham, HoTen, SoDT } = req.body as any;
      const password = req.employee?.MatKhau;
      const MaNV = req.employee?.MaNV;

      console.log(SoDT);

      if (!NgayGioKham && !LyDoKham && !HoTen && !MaNV && !SoDT) {
        return next(
          new ErrorHandler(
            "Vui lòng nhập đầy đủ thông tin lịch hẹn nha sĩ.",
            400
          )
        );
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNV, password);

      connection.on("connect", (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const getLastMaSoHenRequest = new SQLRequest(
          `SELECT MaSoHen FROM LICHHEN`,
          async (err: Error | null, result: any) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            let newMaSoHenNumber = result + 1;

            const randomNumber = Math.floor(Math.random() * 1000) + 1;

            // Create the new MaSoHen by prepending 'MaSoHen' to the new number
            const newMaSoHen: string =
              "MSH" + randomNumber.toString().padStart(2, "0");

            getLastMaSoHenRequest.on("requestCompleted", function () {
              const sql = `InsertAppointmentByEmployee`;

              const insertAppointmentRequest = new SQLRequest(
                sql,
                (err, rowCount) => {
                  if (err) {
                    return next(new ErrorHandler(err.message, 400));
                  }

                  if (rowCount === 0) {
                    return next(
                      new ErrorHandler("Không thể thêm cuộc hẹn", 400)
                    );
                  }

                  return res.status(201).json({
                    success: true,
                    message: "Thêm lịch hẹn thành công",
                  });
                }
              );

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
              insertAppointmentRequest.addParameter(
                "HoTen",
                TYPES.NVarChar,
                HoTen
              );
              insertAppointmentRequest.addParameter(
                "SoDT",
                TYPES.VarChar,
                SoDT
              );

              connection.callProcedure(insertAppointmentRequest);
            });
          }
        );

        connection.execSql(getLastMaSoHenRequest);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllAppointment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllAppointmentsService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllInvoices = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllInvoicesService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateAppointment = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT } =
        req.body as any;
      const password = req.employee?.MatKhau;
      const MaNV = req.employee?.MaNV;

      if (!MaNV) {
        return next(new ErrorHandler("Vui lòng nhập mã nhân viên.", 400));
      }

      if (!MaSoHen && !NgayGioKham && !LyDoKham && !MaNS && !MaKH && !SoDT) {
        return next(
          new ErrorHandler("Vui lòng Cập nhật ít nhất 1 thông tin", 400)
        );
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNV, password);

      connection.on("connect", (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `UpdateLichHen`;

        const updateAppointmentRequest = new SQLRequest(
          sql,
          (err, rowCount) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            if (rowCount === 0) {
              return next(
                new ErrorHandler("Không thể cập nhật thông tin khách hàng", 400)
              );
            }

            return res.status(200).json({
              success: true,
              message: "Cập nhật thông tin lịch hẹn thành công",
            });
          }
        );

        updateAppointmentRequest.addParameter("MaSoHen", TYPES.Char, MaSoHen);
        updateAppointmentRequest.addParameter(
          "NgayGioKham",
          TYPES.DateTime,
          NgayGioKham
        );
        updateAppointmentRequest.addParameter(
          "LyDoKham",
          TYPES.NVarChar,
          LyDoKham
        );
        updateAppointmentRequest.addParameter("MaNS", TYPES.Char, MaNS);
        updateAppointmentRequest.addParameter("MaKH", TYPES.Char, MaKH);
        updateAppointmentRequest.addParameter("SoDT", TYPES.Char, SoDT);

        connection.callProcedure(updateAppointmentRequest);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deleteAppointment = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaSoHen } = req.body as any;
      const password = req.employee?.MatKhau;
      const MaNV = req.employee?.MaNV;

      if (!MaSoHen) {
        return next(new ErrorHandler("Vui lòng nhập mã lịch hẹn.", 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNV, password);

      connection.on("connect", (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC DeleteLichHen ${MaSoHen}
        
        `;

        const deleteAppointmentRequest = new SQLRequest(
          sql,
          (err, rowCount) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            if (rowCount === 0) {
              return next(new ErrorHandler("Không thể xóa lịch hẹn", 400));
            }

            return res.status(200).json({
              success: true,
              message: "Xóa lịch hẹn thành công",
            });
          }
        );

        connection.execSql(deleteAppointmentRequest);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deleteInvoice = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaHoaDon } = req.body as any;
      const password = req.employee?.MatKhau;
      const MaNV = req.employee?.MaNV;

      if (!MaHoaDon) {
        return next(new ErrorHandler("Vui lòng nhập mã hóa đơn.", 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNV, password);

      connection.on("connect", (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC DeleteHoaDon ${MaHoaDon}
        
        `;

        const deleteInvoiceRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể xóa hóa đơn", 400));
          }

          return res.status(200).json({
            success: true,
            message: "Xóa hóa đơn thành công",
          });
        });

        connection.execSql(deleteInvoiceRequest);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createInvoiceByEmployee = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { SoDT, NgayXuat, TongChiPhi, TinhTrangThanhToan, TenDV } =
        req.body as any;
      const password = req.employee?.MatKhau;
      const MaNV = req.employee?.MaNV;

      if (!SoDT || !NgayXuat || !TongChiPhi || !TinhTrangThanhToan || !TenDV) {
        return next(
          new ErrorHandler("Vui lòng nhập đầy đủ thông tin hoá đơn", 400)
        );
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNV, password);

      connection.on("connect", (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const getLastMaHoaDonRequest = new SQLRequest(
          `SELECT MaHoaDon FROM HOADON`,
          async (err: Error | null, result: any) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            let newMaSoHenNumber = result + 1;

            const randomNumber = Math.floor(Math.random() * 1000) + 1;

            // Create the new MaSoHen by prepending 'MaSoHen' to the new number
            const newMaHoaDon: string =
              "HD" + randomNumber.toString().padStart(2, "0");

            getLastMaHoaDonRequest.on("requestCompleted", function () {
              const sql = `CreateHoaDon`;

              const createInvoiceRequest = new SQLRequest(
                sql,
                (err, rowCount) => {
                  if (err) {
                    return next(new ErrorHandler(err.message, 400));
                  }

                  if (rowCount === 0) {
                    return next(
                      new ErrorHandler("Không thể thêm hóa đơn", 400)
                    );
                  }

                  return res.status(201).json({
                    success: true,
                    message: "Thêm hóa đơn thành công",
                  });
                }
              );

              createInvoiceRequest.addParameter(
                "MaHoaDon",
                TYPES.VarChar,
                newMaHoaDon
              );
              createInvoiceRequest.addParameter("SoDT", TYPES.VarChar, SoDT);
              createInvoiceRequest.addParameter(
                "NgayXuat",
                TYPES.DateTime,
                NgayXuat
              );
              createInvoiceRequest.addParameter(
                "TongChiPhi",
                TYPES.BigInt,
                TongChiPhi
              );
              createInvoiceRequest.addParameter(
                "TinhTrangThanhToan",
                TYPES.Char,
                TinhTrangThanhToan
              );
              createInvoiceRequest.addParameter("MaNV", TYPES.Char, MaNV);
              createInvoiceRequest.addParameter("TenDV", TYPES.NVarChar, TenDV);

              connection.callProcedure(createInvoiceRequest);
            });
          }
        );

        connection.execSql(getLastMaHoaDonRequest);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateInvoice = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const {
        MaHoaDon,
        SoDT,
        STT,
        MaKH,
        NgayXuat,
        TongChiPhi,
        TinhTrangThanhToan,
        MaDV,
      } = req.body as any;
      const password = req.employee?.MatKhau;
      const MaNV = req.employee?.MaNV;

      if (!MaHoaDon) {
        return next(new ErrorHandler("Vui lòng nhập mã hóa đơn.", 400));
      }

      if (
        !SoDT &&
        !NgayXuat &&
        !STT &&
        !TongChiPhi &&
        !MaKH &&
        !TinhTrangThanhToan &&
        !MaDV
      ) {
        return next(
          new ErrorHandler("Vui lòng Cập nhật ít nhất 1 thông tin", 400)
        );
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNV, password);

      connection.on("connect", (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `UpdateHoaDon`;

        const updateInvoiceRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(
              new ErrorHandler("Không thể cập nhật thông tin hóa đơn", 400)
            );
          }

          return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin hóa đơn thành công",
          });
        });

        updateInvoiceRequest.addParameter("MaHoaDon", TYPES.Char, MaHoaDon);
        updateInvoiceRequest.addParameter("NgayXuat", TYPES.DateTime, NgayXuat);
        updateInvoiceRequest.addParameter(
          "TinhTrangThanhToan",
          TYPES.Char,
          TinhTrangThanhToan
        );
        updateInvoiceRequest.addParameter("MaNV", TYPES.Char, MaNV);
        updateInvoiceRequest.addParameter(
          "TongChiPhi",
          TYPES.BigInt,
          TongChiPhi
        );
        updateInvoiceRequest.addParameter("STT", TYPES.Int, STT);
        updateInvoiceRequest.addParameter("MaKH", TYPES.Char, MaKH);
        updateInvoiceRequest.addParameter("MaDV", TYPES.Char, MaDV);
        updateInvoiceRequest.addParameter("SoDT", TYPES.Char, SoDT);

        connection.callProcedure(updateInvoiceRequest);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllServiceByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllServicesDentalClinicServiceByUser(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllUsersByEmployee = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllDentistsByEmployee = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllDentistByEmployeeService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);