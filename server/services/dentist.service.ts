import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { ErrorHandler } from "../utils/Errorhandler";
import { IUser } from "../models/user.model";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IDentist } from "../models/dentist.model";
import { IMedicalRecord } from "../models/medicalrecord.model";
import { IMedicine } from "../models/medicine.model";
import { IDentistSchedule } from "../models/dentistschedule.model";
import { IService } from "../models/service.model";
import { IDetailMedicine } from "../models/detailmedicine.model";


export const getDentistById = async (id: string, res: Response) => {
    const dentistJson = await redis.get(id);
  
    if (dentistJson) {
      const dentist = JSON.parse(dentistJson);
      res.status(201).json({
        success: true,
        dentist,
      });
    }
  };

export const getAllMedicineServiceByDoctor = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.dentist?.MatKhau;
        const MaNS = req.dentist?.MaNS;

        const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);
        connection.on('connect', (err) => {
            if (err) {
                return next(new ErrorHandler(err.message, 400));
            }

            const sql = 'EXEC GetAllLoaiThuoc';

            const request = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                    return next(new ErrorHandler(err.message, 400));
                }

                if (rowCount === 0) {
                    return next(new ErrorHandler('Không tìm thấy loại thuốc nào.', 400));
                }
                request.on('requestCompleted', function () {
                    res.status(201).json({
                        success: true,
                        medicines,
                    });
                });
            });

            let medicines: IMedicine[] = [];

            request.on('row', function (columns) {
                const medicine = {
                    MaThuoc: columns[0].value.trim(),
                    TenThuoc: columns[1].value.trim(),
                    DonViTinh: columns[2].value.trim(),
                    ChiDinh: columns[3].value.trim(),
                    SoLuong: columns[4].value,
                    NgayHetHan: new Date(columns[5].value),
                    GiaThuoc: columns[6].value
                };
                medicines.push(medicine);
            });



            connection.execSql(request);
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getAllServicesDentalClinicServiceByDoctor = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.dentist?.MatKhau;
        const MaNS = req.dentist?.MaNS;

        const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);
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

            let services: IService[] = [];

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

export const getAllMedicalRecordService = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.dentist?.MatKhau;
        const MaNS = req.dentist?.MaNS;

        const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);
        connection.on('connect', (err) => {
            if (err) {
                return next(new ErrorHandler(err.message, 400));
            }

            const sql = 'EXEC GetAllMedicalRecord';

            const request = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                    return next(new ErrorHandler(err.message, 400));
                }

                if (rowCount === 0) {
                    return next(new ErrorHandler('Không tìm thấy hồ sơ bệnh nào.', 400));
                }
                request.on('requestCompleted', function () {
                    res.status(201).json({
                        success: true,
                        medicalRecords,
                    });
                });
            });

            let medicalRecords: IMedicalRecord[] = [];

            request.on('row', function (columns) {
                const medicalRecord = {
                    MaKH: columns[0].value.trim(),
                    SoDT: columns[1].value.trim(),
                    STT: columns[2].value,
                    NgayKham: new Date(columns[3].value),
                    DanDo: columns[4].value.trim(),
                    MaNS: columns[5].value.trim(),
                    MaDV: columns[6].value ? columns[6].value.trim() : null,
                    MaThuoc: columns[7].value ? columns[7].value.trim() : null,
                    TinhTrangXuatHoaDon: columns[8].value.trim()
                };
                medicalRecords.push(medicalRecord);
            });

            connection.execSql(request);
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getDentistsScheduleByDentistService = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.dentist?.MatKhau;
        const MaNS = req.dentist?.MaNS;

        const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);

        connection.on('connect', (err) => {
            if (err) {
                return next(new ErrorHandler(err.message, 400));
            }

            const sql = `EXEC GetDentistScheduleByMaNS ${MaNS}`;

            const request = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                    return next(new ErrorHandler(err.message, 400));
                }

                if (rowCount === 0) {
                    return next(new ErrorHandler('Không tìm thấy lịch của nha sĩ nào.', 400));
                }
                request.on('requestCompleted', function () {
                    res.status(201).json({
                        success: true,
                        dentistsSchedules,
                    });
                });
            });

            let dentistsSchedules: IDentistSchedule[] = [];


            request.on('row', function (columns) {
                console.log(columns);
                const dentist = {
                    MaNS: columns[0]?.value.trim(),
                    STT: columns[1]?.value,
                    GioBatDau: new Date(columns[2]?.value),
                    GioKetThuc: new Date(columns[3]?.value),
                    TinhTrangCuocHen: columns[4]?.value.trim(),
                    MaKH: columns[5]?.value ? columns[5]?.value.trim() : null,
                    SoDT: columns[6]?.value ? columns[6]?.value.trim() : null,
                };
                dentistsSchedules.push(dentist);
            });



            connection.execSql(request);


        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getAllDetailMedicineService = async (req: any, res: Response, next: NextFunction) => {
    try {
        const password = req.dentist?.MatKhau;
        const MaNS = req.dentist?.MaNS;

        const connection: Connection = ConnectToDataBaseWithLogin(MaNS, password);
        connection.on('connect', (err) => {
            if (err) {
                return next(new ErrorHandler(err.message, 400));
            }

            const sql = 'EXEC GetAllCHITIETTHUOC';

            const request = new SQLRequest(sql, (err, rowCount) => {
                if (err) {
                    return next(new ErrorHandler(err.message, 400));
                }

                if (rowCount === 0) {
                    return next(new ErrorHandler('Không tìm thấy chi tiết thuốc nào.', 400));
                }
                request.on('requestCompleted', function () {
                    res.status(201).json({
                        success: true,
                        detailMedicines,
                    });
                });
            });

            let detailMedicines: IDetailMedicine[] = [];

            request.on('row', function (columns) {
                const detailMedicine = {
                    MaThuoc: columns[0].value.trim(),
                    MaKH: columns[1].value.trim(),
                    STT: columns[2].value,
                    SoDT: columns[3].value.trim(),
                    SoLuong: columns[4].value,
                    ThoiDiemDung: columns[5].value.trim()
                };
                detailMedicines.push(detailMedicine);
            });

            connection.execSql(request);
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};
