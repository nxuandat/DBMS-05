import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { ErrorHandler } from "../utils/Errorhandler";
import { IAppointment } from "../models/appointment.model";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IInvoice } from "../models/invoice.model";
import { IUser } from "../models/user.model";
import { IDentist } from "../models/dentist.model";


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

export const getAllAppointmentsService = async (req: any, res: Response, next: NextFunction) => {
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

            const sql = 'EXEC GetAllLichHen';

            const request = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                    return next(new ErrorHandler(err.message, 400));
                }

                if (rowCount === 0) {
                    return next(new ErrorHandler('Không tìm thấy lịch hẹn nào.', 400));
                }
            });

            let appointments: IAppointment[] = [];

            request.on('row', function (columns) {
                   console.log(columns);
                const appointment = {
                    MaSoHen: columns[0].value.trim(),
                    NgayGioKham: new Date(columns[1].value),
                    LyDoKham: columns[2].value.trim(),
                    MaNS: columns[3].value.trim(),
                    MaKH: columns[4].value.trim(),
                    SoDT: columns[5].value.trim(),
                    HoTen: ""
                };
                appointments.push(appointment);
            });

            request.on('requestCompleted', function () {
                res.status(201).json({
                    success: true,
                    appointments,
                });
            });

            connection.execSql(request);
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getAllInvoicesService = async (req: any, res: Response, next: NextFunction) => {
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

            const sql = 'EXEC GetAllHoaDon';

            const request = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                    return next(new ErrorHandler(err.message, 400));
                }

                if (rowCount === 0) {
                    return next(new ErrorHandler('Không tìm thấy lịch hẹn nào.', 400));
                }
            });

            let invoices: IInvoice[] = [];

            request.on('row', function (columns) {
                console.log(columns);
                const invoice = {
                    MaHoaDon: columns[0].value.trim(),
                    MaKH: columns[1].value.trim(),
                    SoDT: columns[2].value.trim(),
                    STT: columns[3].value,
                    NgayXuat: new Date(columns[4].value),
                    TongChiPhi: columns[5].value,
                    TinhTrangThanhToan: columns[6].value.trim(),
                    MaNV:columns[7].value.trim(),
                    MaDV:columns[8].value.trim(),
                    
                };
                invoices.push(invoice);
            });

            request.on('requestCompleted', function () {
                res.status(201).json({
                    success: true,
                    invoices,
                });
            });

            connection.execSql(request);
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getAllUsersService = async (req: any, res: Response, next: NextFunction) => {
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

                request.on('requestCompleted', function () {
                    res.status(201).json({
                        success: true,
                        users,
                    });
                });
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

            

            connection.execSql(request);
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getAllDentistByEmployeeService = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.employee?.MatKhau;
        const MaNV = req.employee?.MaNV;

        const connection: Connection = ConnectToDataBaseWithLogin(MaNV, password);

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