import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { ErrorHandler } from "../utils/Errorhandler";
import { IAppointment } from "../models/appointment.model";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IInvoice } from "../models/invoice.model";


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