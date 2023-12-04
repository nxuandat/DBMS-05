import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { ErrorHandler } from "../utils/Errorhandler";
import { IUser } from "../models/user.model";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IDentist } from "../models/dentist.model";
import { IEmployee } from "../models/employee.model";

export const getAdminById = async (id: string, res: Response) => {
    const adminJson = await redis.get(id);
  
    if (adminJson) {
      const admin = JSON.parse(adminJson);
      res.status(201).json({
        success: true,
        admin,
      });
    }
  };

//get all users 
export const getAllUsersService = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.admin?.MatKhau;
        const MaQTV = req.admin?.MaQTV;
        console.log(MaQTV);
        console.log(password);

        const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);
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
                    NgayTao: new Date(columns[8].value)
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

export const getAllDentistByAdminService = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.admin?.MatKhau;
        const MaQTV = req.admin?.MaQTV;

        const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

        connection.on('connect', (err) => {
            if (err) {
                return next(new ErrorHandler(err.message, 400));
            }

            const sql = `EXEC GetAllDentistInfoByAdmin`;

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
                    TenDangNhap: columns[1]?.value ? columns[1].value.trim() : null,
                    HoTen: columns[2]?.value.trim(),
                    Phai: columns[3]?.value.trim(),
                    GioiThieu: columns[4]?.value.trim(),
                    MatKhau: columns[5]?.value ? columns[5].value.trim() : null,
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
    

export const getAllEmployeeService = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.admin?.MatKhau;
        const MaQTV = req.admin?.MaQTV;

        const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);

        connection.on('connect', (err) => {
            if (err) {
                return next(new ErrorHandler(err.message, 400));
            }

            const sql = `EXEC GetAllEmployee`;

            const request = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                    return next(new ErrorHandler(err.message, 400));
                }

                if (rowCount === 0) {
                    return next(new ErrorHandler('Không tìm thấy người dùng nào.', 400));
                }
            });

            let employees: IEmployee[] = [];


            request.on('row', function (columns) {
                console.log(columns);
                const employee = {
                    MaNV: columns[0]?.value.trim(),
                    HoTen: columns[1]?.value.trim(),
                    Phai: columns[2]?.value.trim(),
                    TenDangNhap: columns[3]?.value ? columns[3].value.trim() : null,
                    MatKhau: columns[4]?.value ? columns[4].value.trim() : null,
                };
                employees.push(employee);
            });

            request.on('requestCompleted', function () {
                res.status(201).json({
                    success: true,
                    employees,
                });
            });

            connection.execSql(request);
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getAllRevenueService = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.admin?.MatKhau;
        const MaQTV = req.admin?.MaQTV;
        console.log(MaQTV);
        console.log(password);

        const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);
        connection.on('connect', (err) => {
            if (err) {
                return next(new ErrorHandler(err.message, 400));
            }

            const sql = 'SELECT * FROM DOANHTHU';

            const request = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                    return next(new ErrorHandler(err.message, 400));
                }

                if (rowCount === 0) {
                    return next(new ErrorHandler('Không tìm thấy dữ liệu nào.', 400));
                }
            });

            let doanhthu: IRevenue[] = [];

            request.on('row', function (columns) {
                console.log(columns);
                const doanhthuItem = {
                    TongDoanhThu: columns[0].value,
                    Thang: new Date(columns[1].value)
                };
                doanhthu.push(doanhthuItem);
            });

            request.on('requestCompleted', function () {
                res.status(201).json({
                    success: true,
                    doanhthu,
                });
            });

            connection.execSql(request);
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};