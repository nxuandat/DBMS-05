require("dotenv").config();
import { NextFunction, Response } from "express";
import { IUser } from "../models/user.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { ErrorHandler } from "./Errorhandler";
import { redis } from "./redis";
import jwt from "jsonwebtoken";
import { IDentist } from "../models/dentist.model";
import { IEmployee } from "../models/employee.model";
import { IAdmin } from "../models/admin.model";


interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none" | undefined;
    secure?: boolean;
}

// parse enviroment variables to integrates with fallback values
const accessTokenExpire = parseInt(
    process.env.ACCESS_TOKEN_EXPIRE || "300",
    10
);
const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE || "1200",
    10
);

// options for cookies
export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure:true,
};

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure:true,
};

export const sendUserToken = (req:any, user: IUser, statusCode: number, res: Response) => {
    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN || '',{
        expiresIn: "5m",
    });
    const refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN || '',{
        expiresIn: "3d",
    });

    // upload session to redis
    redis.set(user.MaKH, JSON.stringify(user) as any);
    
    // only set secure to true in production
    if (process.env.NODE_ENV == "production") {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    const access_token = req.cookies.access_token as string;
    console.log("access_token:",access_token)


    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};

export const sendDentistToken = (dentist: IDentist, statusCode: number, res: Response) => {
    const accessToken = jwt.sign({dentist}, process.env.ACCESS_TOKEN || '',{
        expiresIn: "5m",
    });
    const refreshToken = jwt.sign({dentist}, process.env.REFRESH_TOKEN || '',{
        expiresIn: "3d",
    });

    // upload session to redis
    redis.set(dentist.MaNS, JSON.stringify(dentist) as any);
    
    // only set secure to true in production
    if (process.env.NODE_ENV == "production") {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        dentist,
        accessToken,
    });
};

export const sendEmployeeToken = (employee: IEmployee, statusCode: number, res: Response) => {
    const accessToken = jwt.sign({employee}, process.env.ACCESS_TOKEN || '',{
        expiresIn: "5m",
    });
    const refreshToken = jwt.sign({employee}, process.env.REFRESH_TOKEN || '',{
        expiresIn: "3d",
    });

    // upload session to redis
    redis.set(employee.MaNV, JSON.stringify(employee) as any);
    
    // only set secure to true in production
    if (process.env.NODE_ENV == "production") {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        employee,
        accessToken,
    });
};

export const sendAdminToken = (admin: IAdmin, statusCode: number, res: Response) => {
    const accessToken = jwt.sign({admin}, process.env.ACCESS_TOKEN || '',{
        expiresIn: "5m",
    });
    const refreshToken = jwt.sign({admin}, process.env.REFRESH_TOKEN || '',{
        expiresIn: "3d",
    });

    // upload session to redis
    redis.set(admin.MaQTV, JSON.stringify(admin) as any);
    
    // only set secure to true in production
    if (process.env.NODE_ENV == "production") {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        admin,
        accessToken,
    });
};