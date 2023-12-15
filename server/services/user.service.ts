import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { ErrorHandler } from "../utils/Errorhandler";
import { IUser } from "../models/user.model";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IDentist } from "../models/dentist.model";
import { IDentistSchedule } from "../models/dentistschedule.model";
import ConnectToDataBaseDefault from "../utils/db";
import { IService } from "../models/service.model";


// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};


export const getAllDentistByUserService = async (req: any, res: Response, next: NextFunction) => {
  try {


    const connection: Connection = ConnectToDataBaseDefault();

    connection.on('connect', (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 400));
      }

      const sql = `EXEC GetAllDentistInfoByUser`;

      const request = new SQLRequest(sql, (err, rowCount) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        if (rowCount === 0) {
          return next(new ErrorHandler('Không tìm thấy người dùng nào.', 400));
        }
      });

      let dentists: IDentist[] = [];


      request.on('row', function (columns) {
        console.log(columns);
        const dentist = {
          MaNS: columns[0]?.value.trim(),
          TenDangNhap: columns[4]?.value ? columns[4].value.trim() : null,
          HoTen: columns[1]?.value.trim(),
          Phai: columns[2]?.value.trim(),
          GioiThieu: columns[3]?.value.trim(),
          MatKhau: columns[4]?.value ? columns[4].value.trim() : null,
        };
        dentists.push(dentist);
      });

      request.on('requestCompleted', function () {
        res.status(201).json({
          success: true,
          dentists,
        });
      });

      connection.execSql(request);


    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
};


export const getAllDentistsScheduleByUserService = async (req: any, res: Response, next: NextFunction) => {
  try {
    const password = req.user?.MatKhau;
    const MaKH = req.user?.MaKH;

    const connection: Connection = ConnectToDataBaseWithLogin(MaKH, password);

    connection.on('connect', (err) => {
      if (err) {
        return next(new ErrorHandler(err.message, 400));
      }

      const sql = `EXEC GetAllLICHNHASI`;

      const request = new SQLRequest(sql, (err, rowCount) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }

        if (rowCount === 0) {
          return next(new ErrorHandler('Không tìm thấy người dùng nào.', 400));
        }
      });

      let dentistsSchedules: IDentistSchedule[] = [];


      request.on('row', function (columns) {
        console.log(columns);
        const dentist = {
          MaNS: columns[0]?.value.trim(),
          STT: columns[1]?.value,
          GioBatDau: new Date(columns[2]?.value),
          GioKetThuc: new Date(columns[3]?.value),
          TinhTrangCuocHen: columns[4]?.value.trim()
        };
        dentistsSchedules.push(dentist);
      });

      request.on('requestCompleted', function () {
        res.status(201).json({
          success: true,
          dentistsSchedules,
        });
      });

      connection.execSql(request);


    });

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getAllServicesDentalClinicServiceByUser = async (req: any, res: Response, next: NextFunction) => {
  try {
      // const password = req.user?.MatKhau;
      // const MaKH = req.user?.MaNS;

      const connection: Connection = ConnectToDataBaseDefault();
      connection.on('connect', (err) => {
          if (err) {
              return next(new ErrorHandler(err.message, 400));
          }

          const sql = 'EXEC GetAllLoaiDichVu';

          const request = new SQLRequest(sql, (err, rowCount) => {
              if (err) {
                  return next(new ErrorHandler(err.message, 400));
              }

              if (rowCount === 0) {
                  return next(new ErrorHandler('Không tìm thấy loại dịch vụ nào.', 400));
              }
              request.on('requestCompleted', function () {
                  res.status(201).json({
                      success: true,
                      services,
                  });
              });
          });

          let services :IService[] = [];

          request.on('row', function (columns) {
              const service = {
                  MaDV: columns[0].value.trim(),
                  TenDV: columns[1].value.trim(),
                  MoTa: columns[2].value.trim(),
                  DongGia: columns[3].value
              };
              services.push(service);
          });

          connection.execSql(request);
      });
  } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
  }
};
