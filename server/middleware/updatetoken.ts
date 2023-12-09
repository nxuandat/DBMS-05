import { Request, Response, NextFunction} from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import {ErrorHandler} from "../utils/Errorhandler"; 
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import {
    accessTokenOptions,
    refreshTokenOptions,
} from "../utils/jwt";



// update user access token
export const updateUserAccessToken = CatchAsyncError(
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const refresh_token = req.cookies.refresh_token as string;
        const decoded = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN as string
        ) as JwtPayload;
  
        const message = "Could not refresh token";
        if (!decoded) {
          return next(new ErrorHandler(message, 400));
        }
        const session = await redis.get(decoded.user.MaKH as string);
           

        if (!session) {
          return next(
            new ErrorHandler("Please login for access this resources!", 400)
          );
        }
        
        const user = JSON.parse(session);

        console.log(session);
  
        const accessToken = jwt.sign(
          {user},
          process.env.ACCESS_TOKEN as string,
          {
            expiresIn: "5m",
          }
        );
  
        const refreshToken = jwt.sign(
          {user},
          process.env.REFRESH_TOKEN as string,
          {
            expiresIn: "3d",
          }
        );
  
        req.user = user;

  
        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);
  
        await redis.set(user.MaKH, JSON.stringify(user), "EX", 604800); // 7days

        // res.status(200).json({
        //     success: true,
        //     accessToken,
        //     refreshToken,
        // });
  
        return next();
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
);

export const updateDentistAccessToken = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.dentist.MaNS as string);
         

      if (!session) {
        return next(
          new ErrorHandler("Please login for access this resources!", 400)
        );
      }
      
      const dentist = JSON.parse(session);

      console.log(session);

      const accessToken = jwt.sign(
        {dentist},
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        {dentist},
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.dentist = dentist;


      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(dentist.MaNS, JSON.stringify(dentist), "EX", 604800); // 7days

      // res.status(200).json({
      //     success: true,
      //     accessToken,
      //     refreshToken,
      // });

      return next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateEmployeeAccessToken = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.employee.MaNV as string);
         

      if (!session) {
        return next(
          new ErrorHandler("Please login for access this resources!", 400)
        );
      }
      
      const employee = JSON.parse(session);

      console.log(session);

      const accessToken = jwt.sign(
        {employee},
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        {employee},
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.employee = employee;


      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(employee.MaNV, JSON.stringify(employee), "EX", 604800); // 7days

      // res.status(200).json({
      //     success: true,
      //     accessToken,
      //     refreshToken,
      // });

      return next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const updateAdminAccessToken = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.admin.MaQTV as string);
         

      if (!session) {
        return next(
          new ErrorHandler("Please login for access this resources!", 400)
        );
      }
      
      const admin = JSON.parse(session);

      console.log(session);

      const accessToken = jwt.sign(
        {admin},
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        {admin},
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.admin = admin;


      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(admin.MaQTV, JSON.stringify(admin), "EX", 604800); // 7days

      // res.status(200).json({
      //     success: true,
      //     accessToken,
      //     refreshToken,
      // });

      return next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);