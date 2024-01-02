require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { IDentist } from "../models/dentist.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { redis } from "../utils/redis";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendDentistToken,
} from "../utils/jwt";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import cloudinary from "cloudinary";
import { getAllDetailMedicineService, getAllMedicalRecordService, getAllMedicineServiceByDoctor, getAllServicesDentalClinicServiceByDoctor, getDentistById, getDentistsScheduleByDentistService } from "../services/dentist.service";
import { IAppointment } from "../models/appointment.model";

//login dentist
interface ILoginRequest {
  TenDangNhap: string;
  MatKhau: string;
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

        request.on('row', function (columns) {
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

//Update Avatar Dentist
export const updateProfilePictureDentist = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;
      const MaNS = req.dentist?.MaNS;
      const password = req.dentist?.MatKhau;
      const SoDT = "none";

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', async (err: Error | null) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const request = new SQLRequest(`SELECT AvatarUrl FROM LUUTRUANH WHERE MaNguoiDung = @MaNS`, (err) => {
          if (err) {
            throw new ErrorHandler(err.message, 400);
          }
        });

        request.addParameter('MaNS', TYPES.Char, MaNS);

        let dentistAvatar: any;

        request.on('row', (columns) => {
          dentistAvatar = columns[0].value;
        });

        request.on('requestCompleted', async function () {
          if (avatar && dentistAvatar) {
            // first delete the old image
            await cloudinary.v2.uploader.destroy(dentistAvatar);

            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });

            dentistAvatar = myCloud.secure_url;
          } else {
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });

            dentistAvatar = myCloud.secure_url;
          }

          const updateRequest = new SQLRequest(`EXEC UpdateProfilePicture @MaNS, @SoDT, @AvatarUrl`, (err) => {
            if (err) {
              throw new ErrorHandler(err.message, 400);
            }
          });

          updateRequest.addParameter('MaNS', TYPES.Char, MaNS);
          updateRequest.addParameter('SoDT', TYPES.Char, SoDT);
          updateRequest.addParameter('AvatarUrl', TYPES.VarChar, dentistAvatar);

          connection.execSql(updateRequest);

          updateRequest.on('requestCompleted', function () {
            res.status(200).json({
              success: true,
              user: {
                MaNguoiDung: MaNS,
                AvatarUrl: dentistAvatar
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

//Get Dentist Info
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

//Get Avatar Url By Dentist
export const getProfilePictureDentist = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const MaNS = req.dentist?.MaNS;
      const password = req.dentist?.MatKhau;

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', async (err: Error | null) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const request = new SQLRequest(`SELECT AvatarUrl FROM LUUTRUANH WHERE MaNguoiDung = @MaNS`, (err) => {
          if (err) {
            throw new ErrorHandler(err.message, 400);
          }
        });

        request.addParameter('MaNS', TYPES.Char, MaNS);

        let dentistAvatar: any;

        request.on('row', (columns) => {
          dentistAvatar = columns[0].value;
        });

        request.on('requestCompleted', function () {
          res.status(200).json({
            success: true,
            user: {
              MaNguoiDung: MaNS,
              AvatarUrl: dentistAvatar
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


//log out dentist
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

export const getAllMedicineByDoctor = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllMedicineServiceByDoctor(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllServiceByDoctor = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllServicesDentalClinicServiceByDoctor(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllMedicalRecord = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllMedicalRecordService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getDentistsScheduleByDentist = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getDentistsScheduleByDentistService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllDetailMedicineByDoctor = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllDetailMedicineService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createMedicalRecord = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { SoDT, NgayKham, DanDo, TenDV, TenThuoc, TinhTrangXuatHoaDon } = req.body as any;
      const password = req.dentist?.MatKhau;
      const MaNS = req.dentist?.MaNS;

      if (!SoDT || !NgayKham || !DanDo || !TenDV || !TinhTrangXuatHoaDon) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin hồ sơ bệnh.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `InsertMedicalRecord`;

        const STT = Math.floor(Math.random() * 1000) + 1;

        const insertMedicalRecordRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể thêm hồ sơ bệnh", 400));
          }
          return res.status(201).json({
            success: true,
            message: "Thêm hồ sơ bệnh thành công"
          });
        });

        insertMedicalRecordRequest.addParameter('SoDT', TYPES.Char, SoDT);
        insertMedicalRecordRequest.addParameter('STT', TYPES.Int, STT);
        insertMedicalRecordRequest.addParameter('NgayKham', TYPES.Date, NgayKham);
        insertMedicalRecordRequest.addParameter('DanDo', TYPES.NVarChar, DanDo);
        insertMedicalRecordRequest.addParameter('MaNS', TYPES.Char, MaNS);
        insertMedicalRecordRequest.addParameter('TenDV', TYPES.NVarChar, TenDV);
        insertMedicalRecordRequest.addParameter('TenThuoc', TYPES.NVarChar, TenThuoc);
        insertMedicalRecordRequest.addParameter('TinhTrangXuatHoaDon', TYPES.Char, TinhTrangXuatHoaDon);

        connection.callProcedure(insertMedicalRecordRequest);
      })



    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const deleteMedicalRecord = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { SoDT } = req.body as any;
      const password = req.dentist?.MatKhau;
      const MaNS = req.dentist?.MaNS;


      if (!SoDT) {
        return next(new ErrorHandler('Vui lòng nhập số điện thoại.', 400));
      }




      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC DeleteMedicalRecordBySoDT '${SoDT}'
        `;

        const deleteMedicalRecordRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể xóa hồ sơ bệnh", 400));
          }

          return res.status(200).json({
            success: true,
            message: "Xóa hồ sơ bệnh thành công"
          });
        });


        connection.execSql(deleteMedicalRecordRequest);
      })



    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createDentistSchedule = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { GioBatDau, GioKetThuc, TinhTrangCuocHen, MaKH, SoDT } = req.body as any;
      const MaNS = req.dentist?.MaNS
      const password = req.dentist?.MatKhau;

      if (!MaNS || !GioBatDau || !GioKetThuc || !TinhTrangCuocHen) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin lịch.', 400));
      }

      if (TinhTrangCuocHen !== 'ChuaHen') {
        return next(new ErrorHandler('TinhTrangCuocHen phải là "ChuaHen".', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `ThemLichNhaSi`;

        const STT = Math.floor(Math.random() * 1000) + 1;

        const insertDentistScheduleRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể thêm lịch nha sĩ", 400));
          }
          return res.status(201).json({
            success: true,
            message: "Thêm lịch nha sĩ thành công"
          });
        });

        insertDentistScheduleRequest.addParameter('MaNS', TYPES.Char, MaNS);
        insertDentistScheduleRequest.addParameter('STT', TYPES.Int, STT);
        insertDentistScheduleRequest.addParameter('GioBatDau', TYPES.DateTime, new Date(GioBatDau));
        insertDentistScheduleRequest.addParameter('GioKetThuc', TYPES.DateTime, new Date(GioKetThuc));
        insertDentistScheduleRequest.addParameter('TinhTrangCuocHen', TYPES.Char, TinhTrangCuocHen);
        insertDentistScheduleRequest.addParameter('MaKH', TYPES.Char, MaKH);
        insertDentistScheduleRequest.addParameter('SoDT', TYPES.Char, SoDT);
        connection.callProcedure(insertDentistScheduleRequest);
      })

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deleteDentistSchedule = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { STT } = req.body as any;
      const MaNS = req.dentist?.MaNS;
      const password = req.dentist?.MatKhau;

      if (!STT) {
        return next(new ErrorHandler('Vui lòng nhập số thứ tự.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `EXEC XoaLichNhaSi '${MaNS}', ${STT}`;

        const deleteDentistScheduleRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể xóa lịch nha sĩ", 400));
          }

          return res.status(200).json({
            success: true,
            message: "Xóa lịch nha sĩ thành công"
          });
        });

        connection.execSql(deleteDentistScheduleRequest);
      })

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateDentistSchedule = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { STT, GioBatDau, GioKetThuc } = req.body as any;
      const MaNS = req.dentist?.MaNS;
      const password = req.dentist?.MatKhau;

      if (!STT && !GioBatDau && !GioKetThuc) {
        return next(new ErrorHandler('Vui lòng cập nhật ít nhất 1 thông tin', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `SuaLichNhaSi`;

        const updateDentistScheduleRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể cập nhật lịch nha sĩ", 400));
          }

          return res.status(200).json({
            success: true,
            message: "Cập nhật lịch nha sĩ thành công"
          });
        });

        updateDentistScheduleRequest.addParameter('MaNS', TYPES.Char, MaNS);
        updateDentistScheduleRequest.addParameter('STT', TYPES.Int, STT);
        updateDentistScheduleRequest.addParameter('GioBatDau', TYPES.DateTime, new Date(GioBatDau));
        updateDentistScheduleRequest.addParameter('GioKetThuc', TYPES.DateTime, new Date(GioKetThuc));

        connection.callProcedure(updateDentistScheduleRequest);
      })

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createDetailMedicine = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { TenThuoc, HoTen, SoDT, SoLuong, ThoiDiemDung } = req.body as any;
      const password = req.dentist?.MatKhau;
      const MaNS = req.dentist?.MaNS;

      if (!TenThuoc || !HoTen || !SoDT || !SoLuong || !ThoiDiemDung) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin chi tiết thuốc.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `CreateCHITIETTHUOC`;

        const createDetailMedicineRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể thêm chi tiết thuốc", 400));
          }
          return res.status(201).json({
            success: true,
            message: "Thêm chi tiết thuốc thành công"
          });
        });

        createDetailMedicineRequest.addParameter('TenThuoc', TYPES.NVarChar, TenThuoc);
        createDetailMedicineRequest.addParameter('HoTen', TYPES.NVarChar, HoTen);
        createDetailMedicineRequest.addParameter('SoDT', TYPES.Char, SoDT);
        createDetailMedicineRequest.addParameter('SoLuong', TYPES.Int, SoLuong);
        createDetailMedicineRequest.addParameter('ThoiDiemDung', TYPES.NVarChar, ThoiDiemDung);

        connection.callProcedure(createDetailMedicineRequest);
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateDetailMedicine = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaThuoc, MaKH, SoDT, STT, SoLuong, ThoiDiemDung } = req.body as any;
      const password = req.dentist?.MatKhau;
      const MaNS = req.dentist?.MaNS;

      if (!MaThuoc || !MaKH || !SoDT || !STT) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin chi tiết thuốc.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `UpdateCHITIETTHUOC`;

        const updateDetailMedicineRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể cập nhật chi tiết thuốc", 400));
          }

          return res.status(200).json({
            success: true,
            message: "Cập nhật chi tiết thuốc thành công"
          });
        });

        updateDetailMedicineRequest.addParameter('MaThuoc', TYPES.Char, MaThuoc);
        updateDetailMedicineRequest.addParameter('MaKH', TYPES.Char, MaKH);
        updateDetailMedicineRequest.addParameter('SoDT', TYPES.Char, SoDT);
        updateDetailMedicineRequest.addParameter('STT', TYPES.Int, STT);
        updateDetailMedicineRequest.addParameter('SoLuong', TYPES.Int, SoLuong);
        updateDetailMedicineRequest.addParameter('ThoiDiemDung', TYPES.NVarChar, ThoiDiemDung);

        connection.callProcedure(updateDetailMedicineRequest);
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deleteDetailMedicine = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { MaThuoc, MaKH, SoDT, STT } = req.body as any;
      const password = req.dentist?.MatKhau;
      const MaNS = req.dentist?.MaNS;

      if (!MaThuoc || !MaKH || !SoDT || !STT) {
        return next(new ErrorHandler('Vui lòng nhập đầy đủ thông tin chi tiết thuốc.', 400));
      }

      const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        const sql = `DeleteCHITIETTHUOC`;

        const deleteDetailMedicineRequest = new SQLRequest(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          if (rowCount === 0) {
            return next(new ErrorHandler("Không thể xóa chi tiết thuốc", 400));
          }

          return res.status(200).json({
            success: true,
            message: "Xóa chi tiết thuốc thành công"
          });
        });

        deleteDetailMedicineRequest.addParameter('MaThuoc', TYPES.Char, MaThuoc);
        deleteDetailMedicineRequest.addParameter('MaKH', TYPES.Char, MaKH);
        deleteDetailMedicineRequest.addParameter('SoDT', TYPES.Char, SoDT);
        deleteDetailMedicineRequest.addParameter('STT', TYPES.Int, STT);

        connection.callProcedure(deleteDetailMedicineRequest);
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAppointmentByDentist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const password = req.dentist?.MatKhau;
    const MaNS = req.dentist?.MaNS;

    const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

    connection.on('connect', (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 400));
      }

      const sql = `EXEC GetAppointmentByDentist ${MaNS}`;

      const request = new SQLRequest(sql, (err, rowCount) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }
        console.log(rowCount)

        // if (rowCount === 0) {
        //   return next(new ErrorHandler('Không tìm thấy lịch hẹn nào.', 400));
        // }
        request.on('requestCompleted', function () {
          res.status(200).json({
            success: true,
            appointments,
          });
        });
      });

      let appointments: IAppointment[] = [];

      request.on('row', function (columns) {
        const appointment = {
          MaSoHen: columns[0]?.value.trim(),
          NgayGioKham: new Date(columns[1]?.value),
          LyDoKham: columns[2]?.value.trim(),
          MaNS: columns[3]?.value.trim(),
          MaKH: columns[4]?.value.trim(),
          SoDT: columns[5]?.value.trim(),
          HoTen: columns[6]?.value.trim(),
        };
        appointments.push(appointment);
      });

      connection.execSql(request);
    });

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
};





