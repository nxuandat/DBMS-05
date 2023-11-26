import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { ErrorHandler } from "../utils/Errorhandler";
import { IEmployee } from "../models/employee.model";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IUser } from "../models/user.model";

export const getEmployeeById = async (id: string, res: Response) => {
    const employeeJson = await redis.get(id);
  
    if (employeeJson) {
      const employee = JSON.parse(employeeJson);
      res.status(201).json({
        success: true,
        employee,
      });
    }
  };

//get all users 
export const getAllUsersByEmployeeService = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.employee?.MatKhau;
        const MaNV = req.employee?.MaNV;
        console.log(MaNV);
        console.log(password);

        const connection: Connection = ConnectToDataBaseWithLogin(MaNV, password);
        connection.on('connect', (err) => {
            if (err) {
                return next(new ErrorHandler(err.message, 400));
            }

            const sql = 'EXEC GetAllUsers';

            const request = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                    return next(new ErrorHandler(err.message, 400));
                }

                if (rowCount === 0) {
                    return next(new ErrorHandler('Không tìm thấy người dùng nào.', 400));
                }
            });

            let users: IUser[] = [];

            request.on('row', function (columns) {
                //   console.log(columns);
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

            request.on('requestCompleted', function () {
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