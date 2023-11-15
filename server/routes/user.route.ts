import express from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserInfo,
  updateUserInfo,
  createAppointment,
  getMedicalRecordByUser
} from "../controllers/user.controller";

import { isAuthenticatedUserLogin } from "../middleware/auth";
import { updateUserAccessToken } from "../middleware/updatetoken";


const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/user/login", loginUser);

userRouter.get("/user/logout", isAuthenticatedUserLogin, logoutUser);

userRouter.get("/get-users", isAuthenticatedUserLogin, getAllUsers);

userRouter.get("/user/me", isAuthenticatedUserLogin, getUserInfo);

userRouter.put("/user/update-user-info",isAuthenticatedUserLogin, updateUserInfo);

userRouter.post("/user/update-access-token",updateUserAccessToken);

userRouter.post("/user/create-appointment",isAuthenticatedUserLogin,createAppointment);

userRouter.get("/user/get-medical-record", isAuthenticatedUserLogin, getMedicalRecordByUser);


export default userRouter;