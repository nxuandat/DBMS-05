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