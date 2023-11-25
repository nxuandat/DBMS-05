import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import { ErrorHandler } from "../utils/Errorhandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/jwt";
import { updateAdminAccessToken, updateDentistAccessToken, updateEmployeeAccessToken, updateUserAccessToken } from "./updatetoken";



// authenticated user login
export const isAuthenticatedUserLogin = CatchAsyncError(async (req: any, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token as string;

  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }

  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;




  if (!decoded) {
    return next(new ErrorHandler("access token is not valid", 400));
  }


  // const user = await redis.get(decoded.user.MaKH);

  // if (!user) {
  //     return next (new ErrorHandler ("Please login to access this resource", 400));
  // }


  // req.user = JSON.parse(user);

  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    try {
      await updateUserAccessToken(req, res, next);
    } catch (error) {
      return next(error);
    }
  } else {
    const user = await redis.get(decoded.user.MaKH);

    if (!user) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    req.user = JSON.parse(user);
    next();


  }
}
);


// authenticated dentist
export const isAuthenticatedDentistLogin = CatchAsyncError(async (req: any, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token as string;

  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }

  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

  if (!decoded) {
    return next(new ErrorHandler("access token is not valid", 400));
  }

  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    try {
      await updateDentistAccessToken(req, res, next);
    } catch (error) {
      return next(error);
    }
  } else {
    const dentist = await redis.get(decoded.dentist.MaNS);

    if (!dentist) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    req.dentist = JSON.parse(dentist);
    next();


  }
});

//authenticated employee
export const isAuthenticatedEmployeeLogin = CatchAsyncError(async (req: any, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token as string;

  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }

  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

  if (!decoded) {
    return next(new ErrorHandler("access token is not valid", 400));
  }

  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    try {
      await updateEmployeeAccessToken(req, res, next);
    } catch (error) {
      return next(error);
    }
  } else {
    const employee = await redis.get(decoded.employee.MaNV);

    if (!employee) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    req.employee = JSON.parse(employee);
    next();


  }
});

//authenticated admin
export const isAuthenticatedAdminLogin = CatchAsyncError(async (req: any, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token as string;

  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }

  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

  if (!decoded) {
    return next(new ErrorHandler("access token is not valid", 400));
  }

  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    try {
      await updateAdminAccessToken(req, res, next);
    } catch (error) {
      return next(error);
    }
  } else {
    const admin = await redis.get(decoded.admin.MaQTV);

    if (!admin) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    req.admin = JSON.parse(admin);
    next();


  }
});