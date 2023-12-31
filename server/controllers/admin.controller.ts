require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { redis } from "../utils/redis";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendAdminToken,
} from "../utils/jwt";
import { IAdmin } from "../models/admin.model";
import { getAdminById, getAllDentistByAdminService, getAllEmployeeService, getAllMedicineService, getAllRevenueService, getAllUsersService } from "../services/admin.service";
import { generateLast12MonthsDataAppointment, generateLast12MonthsDataInvoice, generateLast12MonthsDataUser } from "../utils/analytics.generator";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import moment from 'moment';

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

        request.on('row', function (columns) {
          console.log(columns);
          const admin: IAdmin = {
            MaQTV: columns[0].value.trim(),
            HoTen: columns[1].value.trim(),
            Phai: columns[2].value.trim(),
            TenDangNhap: columns[3].value.trim(),
            MatKhau: columns[4].value.trim(),
          };
          sendAdminToken(req,admin, 200, res);
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

      const users = await generateLast12MonthsDataUser(MaQTV, password);

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

      const invoices = await generateLast12MonthsDataInvoice(MaQTV, password);

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

      const appointments = await generateLast12MonthsDataAppointment(MaQTV, password);

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

export const addMedicineByAdmin = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { TenThuoc, DonViTinh, ChiDinh, SoLuong, NgayHetHan, GiaThuoc } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      if (!TenThuoc && !DonViTinh && !ChiDinh && !SoLuong && !NgayHetHan && !GiaThuoc) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin thuốc.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const getLastMaThuocRequest = new SQLRequest(`SELECT MaThuoc FROM LOAITHUOC`, async (err: Error | null, result: any) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          let newMaThuocNumber = result + 1;

          const randomNumber = Math.floor(Math.random() * 1000) + 1;

          // Create the new MaThuoc by prepending 'T' to the new number
          const newMaThuoc: string = 'T' + randomNumber.toString().padStart(2, '0');

          const sql = `AddMedicineByAdmin`;

          const addMedicineRequest = new SQLRequest(sql, (err, rowCount) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            if (rowCount === 0) {
              return next(new ErrorHandler("Không thể thêm thuốc", 400));
            }
          });

          addMedicineRequest.addParameter('MaThuoc', TYPES.Char, newMaThuoc);
          addMedicineRequest.addParameter('TenThuoc', TYPES.NVarChar, TenThuoc);
          addMedicineRequest.addParameter('DonViTinh', TYPES.NVarChar, DonViTinh);
          addMedicineRequest.addParameter('ChiDinh', TYPES.NVarChar, ChiDinh);
          addMedicineRequest.addParameter('SoLuong', TYPES.Int, SoLuong);
          addMedicineRequest.addParameter('NgayHetHan', TYPES.Date, NgayHetHan);
          addMedicineRequest.addParameter('GiaThuoc', TYPES.BigInt, GiaThuoc);

          connection.callProcedure(addMedicineRequest);
        })

        connection.execSql(getLastMaThuocRequest);

      })

      return res.status(201).json({
        success: true,
        message: "Thêm thuốc thành công"
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deleteMedicineByAdmin = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaThuoc } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      if (!MaThuoc) {
        return next(new ErrorHandler('Vui lòng nhập mã thuốc.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `DeleteMedicineByAdmin`;

        const deleteMedicineRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể xóa thuốc", 400));
          }
        });

        deleteMedicineRequest.addParameter('MaThuoc', TYPES.Char, MaThuoc);

        connection.callProcedure(deleteMedicineRequest);
      })

      return res.status(200).json({
        success: true,
        message: "Xóa thuốc thành công"
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateMedicineByAdmin = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaThuoc, SoLuong } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      if (!MaThuoc && !SoLuong) {
        return next(new ErrorHandler('Vui lòng nhập mã thuốc và số lượng.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `UpdateMedicineByAdmin`;

        const updateMedicineRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể cập nhật thuốc", 400));
          }
        });

        updateMedicineRequest.addParameter('MaThuoc', TYPES.Char, MaThuoc);
        updateMedicineRequest.addParameter('SoLuong', TYPES.Int, SoLuong);

        connection.callProcedure(updateMedicineRequest);
      })

      return res.status(200).json({
        success: true,
        message: "Cập nhật thuốc thành công"
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllMedicine = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllMedicineService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const addUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      if (!SoDT && !HoTen && !Phai && !NgaySinh && !DiaChi && !MatKhau && !Email) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin khách hàng.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const getLastMaKHRequest = new SQLRequest(`SELECT MaKH FROM KHACHHANG`, async (err: Error | null, result: any) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          let newMaKHNumber = result + 1;

          const randomNumber = Math.floor(Math.random() * 1000) + 1;

          // Create the new MaThuoc by prepending 'T' to the new number
          const MaKH: string = 'KH' + randomNumber.toString().padStart(2, '0');
          console.log(MaKH);
          const sql = `EXEC AddUser '${MaKH}','${SoDT}',N'${HoTen}','${Phai}','${NgaySinh}',N'${DiaChi}','${MatKhau}','${Email}'
            
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
            `;

          const addUserRequest = new SQLRequest(sql, (err, rowCount) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            if (rowCount === 0) {
              return next(new ErrorHandler("Không thể thêm khách hàng", 400));
            }

            return res.status(201).json({
              success: true,
              message: "Thêm khách hàng thành công"
            });

          });



          connection.execSql(addUserRequest);
        })

        connection.execSql(getLastMaKHRequest);


      })

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const deleteUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaKH } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      if (!MaKH) {
        return next(new ErrorHandler('Vui lòng nhập mã khách hàng.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC DeleteUser ${MaKH}
        USE PHONGKHAMNHASI;
        DROP USER ${MaKH};

        USE master;
        DROP LOGIN ${MaKH};
        `;

        const deleteUserRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể xóa khách hàng", 400));
          }

          return res.status(200).json({
            success: true,
            message: "Xóa khách hàng thành công"
          });
        });


        connection.execSql(deleteUserRequest);
      })



    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const updateUserByAdmin = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      if (!MaKH) {
        return next(new ErrorHandler('Vui lòng nhập mã khách hàng.', 400));
      }


      if (!SoDT && !HoTen && !Phai && !NgaySinh && !DiaChi && !MatKhau && !Email) {
        return next(new ErrorHandler('Vui lòng Cập nhật ít nhất 1 thông tin', 400));
      }



      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `UpdateUser`;

        const updateUserRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể cập nhật thông tin khách hàng", 400));
          }

          if (MatKhau) {
            updateUserRequest.on('requestCompleted', function () {
              const sql = `ALTER LOGIN ${MaKH} WITH PASSWORD = '${MatKhau}'`;

              const updatePasswordUser = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                  return next(new ErrorHandler(err.message, 400));
                }

              });

              connection.execSql(updatePasswordUser);


            })
          }

          return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin khách hàng thành công"
          });
        });

        updateUserRequest.addParameter('HoTen', TYPES.NVarChar, HoTen);
        updateUserRequest.addParameter('Phai', TYPES.Char, Phai);
        updateUserRequest.addParameter('NgaySinh', TYPES.DateTime, NgaySinh);
        updateUserRequest.addParameter('DiaChi', TYPES.NVarChar, DiaChi);
        updateUserRequest.addParameter('SoDT', TYPES.Char, SoDT);
        updateUserRequest.addParameter('Email', TYPES.Char, Email);
        updateUserRequest.addParameter('MatKhau', TYPES.Char, MatKhau);
        updateUserRequest.addParameter('MaKH', TYPES.Char, MaKH);


        connection.callProcedure(updateUserRequest);
      })



    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const addDentist = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { TenDangNhap, HoTen, Phai, GioiThieu, MatKhau } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      if (!TenDangNhap || !HoTen || !Phai || !GioiThieu || !MatKhau) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin nha sĩ.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const getLastMaNSRequest = new SQLRequest(`SELECT MaNS FROM NHASI`, async (err: Error | null, result: any) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          let newMaNSNumber = result + 1;

          const randomNumber = Math.floor(Math.random() * 1000) + 1;


          // Create the new MaThuoc by prepending 'T' to the new number
          const MaNS: string = 'NS' + randomNumber.toString().padStart(2, '0');
          console.log(MaNS);
          const sql = `EXEC AddDentist '${MaNS}','${TenDangNhap}',N'${HoTen}', '${Phai}', N'${GioiThieu}', '${MatKhau}'
          CREATE LOGIN ${MaNS}
          WITH PASSWORD = '${MatKhau}',
          CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
          DEFAULT_DATABASE = PHONGKHAMNHASI
          
          CREATE USER ${MaNS}
          for login ${MaNS}

          GRANT SELECT,UPDATE, INSERT, DELETE
          ON HOSOBENH TO ${MaNS}

          GRANT SELECT,UPDATE, INSERT, DELETE
          ON LICHNHASI TO ${MaNS}

          GRANT SELECT
          ON LOAITHUOC TO ${MaNS}

          GRANT SELECT
          ON LOAIDICHVU TO ${MaNS}

          GRANT SELECT
          ON LICHHEN TO ${MaNS}

          GRANT SELECT,DELETE,UPDATE,INSERT
          ON LUUTRUANH TO ${MaNS}

          GRANT EXECUTE ON UpdateProfilePicture TO ${MaNS}
          GRANT EXECUTE ON GetAllMedicalRecord TO ${MaNS}
          GRANT EXECUTE ON InsertMedicalRecord TO ${MaNS}
          GRANT EXECUTE ON UpdateMedicalRecord TO ${MaNS}
          GRANT EXECUTE ON DeleteMedicalRecordBySoDT TO ${MaNS}
          GRANT EXECUTE ON ThemLichNhaSi TO ${MaNS}
          GRANT EXECUTE ON SuaLichNhaSi TO ${MaNS}
          GRANT EXECUTE ON GetAllLoaiDichVu TO ${MaNS}
          GRANT EXECUTE ON GetAllLoaiThuoc TO ${MaNS}
          GRANT EXECUTE ON GetDentistScheduleByMaNS TO ${MaNS}
          GRANT EXECUTE ON XoaLichNhaSi TO ${MaNS}
          GRANT EXECUTE ON CreateCHITIETTHUOC TO ${MaNS}
          GRANT EXECUTE ON UpdateCHITIETTHUOC TO ${MaNS}
          GRANT EXECUTE ON DeleteCHITIETTHUOC TO ${MaNS}
          GRANT EXECUTE ON GetAllCHITIETTHUOC TO ${MaNS}
          GRANT EXECUTE ON GetAppointmentByDentist TO ${MaNS}
          `;

          const addDentistRequest = new SQLRequest(sql, (err, rowCount) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            if (rowCount === 0) {
              return next(new ErrorHandler("Không thể thêm nha sĩ", 400));
            }

            return res.status(201).json({
              success: true,
              message: "Thêm nha sĩ thành công"
            });

          });



          connection.execSql(addDentistRequest);
        })

        connection.execSql(getLastMaNSRequest);


      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const deleteDentist = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaNS } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      console.log(MaNS);

      if (!MaNS) {
        return next(new ErrorHandler('Vui lòng nhập mã nha sĩ.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC DeleteDentist '${MaNS}'
        USE PHONGKHAMNHASI;
        DROP USER ${MaNS};

        USE master;
        DROP LOGIN ${MaNS};
        `;

        const deleteDentistRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể xóa nha sĩ", 400));
          }

          return res.status(200).json({
            success: true,
            message: "Xóa nha sĩ thành công"
          });
        });


        connection.execSql(deleteDentistRequest);
      })



    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const updateDentistByAdmin = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaNS, TenDangNhap, HoTen, Phai, GioiThieu, MatKhau } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      

      // if (!MaNS) {
      //   return next(new ErrorHandler('Vui lòng nhập mã nha sĩ.', 400));
      // }


      if (!TenDangNhap && !HoTen && !Phai && !GioiThieu && !MatKhau) {
        return next(new ErrorHandler('Vui lòng Cập nhật ít nhất 1 thông tin', 400));
      }



      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `UpdateDentist`;

        const updateDentistRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể cập nhật thông tin nha sĩ", 400));
          }

          if (MatKhau) {
            updateDentistRequest.on('requestCompleted', function () {
              const sql = `ALTER LOGIN ${MaNS} WITH PASSWORD = '${MatKhau}'`;

              const updatePasswordDentist = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                  return next(new ErrorHandler(err.message, 400));
                }

              });

              connection.execSql(updatePasswordDentist);


            })
          }

          return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin nha sĩ thành công"
          });
        });

        updateDentistRequest.addParameter('MaNS', TYPES.Char, MaNS);
        updateDentistRequest.addParameter('HoTen', TYPES.NVarChar, HoTen);
        updateDentistRequest.addParameter('TenDangNhap', TYPES.Char, TenDangNhap);
        updateDentistRequest.addParameter('GioiThieu', TYPES.NVarChar, GioiThieu);
        updateDentistRequest.addParameter('Phai', TYPES.Char, Phai);
        updateDentistRequest.addParameter('MatKhau', TYPES.Char, MatKhau);
        

        connection.callProcedure(updateDentistRequest);
      })



    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const deleteEmployee = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaNV } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;


      // if (!MaNV) {
      //   return next(new ErrorHandler('Vui lòng nhập mã nhân viên.', 400));
      // }

      console.log(MaNV);


      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC DeleteEmployee '${MaNV}'
        USE PHONGKHAMNHASI;
        DROP USER ${MaNV};

        USE master;
        DROP LOGIN ${MaNV};
        `;

        const deleteEmployeeRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể xóa nhân viên", 400));
          }

          return res.status(200).json({
            success: true,
            message: "Xóa nhân viên thành công"
          });
        });


        connection.execSql(deleteEmployeeRequest);
      })



    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateEmployeeByAdmin = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaNV, HoTen, Phai, TenDangNhap, MatKhau } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      

      // if (!MaNS) {
      //   return next(new ErrorHandler('Vui lòng nhập mã nha sĩ.', 400));
      // }


      if (!TenDangNhap && !HoTen && !Phai && !MatKhau) {
        return next(new ErrorHandler('Vui lòng Cập nhật ít nhất 1 thông tin', 400));
      }




      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `UpdateEmployee`;

        const updateEmployeeRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể cập nhật thông tin nhân viên", 400));
          }

          if (MatKhau) {
            updateEmployeeRequest.on('requestCompleted', function () {
              const sql = `ALTER LOGIN ${MaNV} WITH PASSWORD = '${MatKhau}'`;

              const updatePasswordEmployee = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                  return next(new ErrorHandler(err.message, 400));
                }

              });

              connection.execSql(updatePasswordEmployee);


            })
          }

          return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin nhân vien thành công"
          });
        });

        updateEmployeeRequest.addParameter('MaNV', TYPES.Char, MaNV);
        updateEmployeeRequest.addParameter('HoTen', TYPES.NVarChar, HoTen);
        updateEmployeeRequest.addParameter('TenDangNhap', TYPES.Char, TenDangNhap);
        updateEmployeeRequest.addParameter('Phai', TYPES.Char, Phai);
        updateEmployeeRequest.addParameter('MatKhau', TYPES.Char, MatKhau);
        

        connection.callProcedure(updateEmployeeRequest);
      })



    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const addEmployee = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { TenDangNhap, HoTen, Phai, MatKhau } = req.body as any;
      const password = req.admin?.MatKhau;
      const MaQTV = req.admin?.MaQTV;

      if (!TenDangNhap || !HoTen || !Phai || !MatKhau) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin nhân viên.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const getLastMaNVRequest = new SQLRequest(`SELECT MaNV FROM NHANVIEN`, async (err: Error | null, result: any) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          let newMaNVNumber = result + 1;

          const randomNumber = Math.floor(Math.random() * 1000) + 1;


          
          const MaNV: string = 'NV' + randomNumber.toString().padStart(2, '0');
          console.log(MaNV);
          const sql = `EXEC AddEmployee '${MaNV}', N'${HoTen}', '${Phai}', '${TenDangNhap}', '${MatKhau}'
         
          CREATE LOGIN ${MaNV}
          WITH PASSWORD = '${MatKhau}',
          CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
          DEFAULT_DATABASE = PHONGKHAMNHASI

          CREATE USER ${MaNV}
          for login ${MaNV}

          GRANT SELECT,DELETE,UPDATE,INSERT
          ON LICHHEN TO ${MaNV}

          GRANT SELECT,DELETE,UPDATE,INSERT
          ON HOADON TO ${MaNV}

          GRANT SELECT
          ON NHASI TO ${MaNV}

          GRANT SELECT
          ON KHACHHANG TO ${MaNV}

          GRANT EXECUTE ON InsertAppointmentByEmployee TO ${MaNV}
          GRANT EXECUTE ON GetAllLichHen TO ${MaNV}
          GRANT EXECUTE ON GetAllHoaDon TO ${MaNV}
          GRANT EXECUTE ON CreateHoaDon TO ${MaNV}
          GRANT EXECUTE ON UpdateHoaDon TO ${MaNV}
          GRANT EXECUTE ON UpdateLichHen TO ${MaNV}
          GRANT EXECUTE ON DeleteLichHen TO ${MaNV}
          GRANT EXECUTE ON DeleteHoaDon TO ${MaNV}
          `;

          const addEmployeeRequest = new SQLRequest(sql, (err, rowCount) => {
            if (err) {
              return next(new ErrorHandler(err.message, 400));
            }

            if (rowCount === 0) {
              return next(new ErrorHandler("Không thể thêm nhân viên", 400));
            }

            return res.status(201).json({
              success: true,
              message: "Thêm nhân viên thành công"
            });

          });



          connection.execSql(addEmployeeRequest);
        })

        connection.execSql(getLastMaNVRequest);


      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


