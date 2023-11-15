import { Response,NextFunction  } from "express";
import { redis } from "../utils/redis";
import { Connection, Request, TYPES } from 'tedious';
import ConnectToDataBase  from '../utils/db';
import { ErrorHandler } from "../utils/Errorhandler";
import { IUser } from "../models/user.model";


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

//get all users 
export const getAllUsersService = async (req: any, res: Response, next: NextFunction) => {
    try {
      const connection: Connection = ConnectToDataBase();
      connection.on('connect', (err) => {
        if (err) {
          return next(new ErrorHandler(err.message, 400));
        }
  
        const sql = 'EXEC GetAllUsers';
  
        const request = new Request(sql, (err, rowCount) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }
  
          if (rowCount === 0) {
            return next(new ErrorHandler('Không tìm thấy người dùng nào.', 400));
          }
        });
  
        let users:IUser[] = [];
  
        request.on('row', function(columns) {
          console.log(columns);
          const user = {
            MaKH: columns[0].value.trim(),
            SoDT: columns[1].value.trim(),
            HoTen: columns[2].value.trim(),
            Phai: columns[3].value.trim(),
            NgaySinh: new Date(columns[4].value),
            DiaChi: columns[5].value.trim(),
            MatKhau: columns[6].value.trim(),
            Email: columns[7].value.trim(),
          };
          users.push(user);
        });
  
        request.on('requestCompleted', function() {
          res.status(201).json({
            success: true,
            users,
          });
        });
  
        connection.execSql(request);
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  };