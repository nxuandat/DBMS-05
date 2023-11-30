import express from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
  getUserInfo,
  updateUserInfo,
  createAppointment,
  getMedicalRecordByUser,
  getAllDentistsByUser,
  getAllDentistsScheduleByUser,
  sendResetPasswordEmail,
  ResetPasswordByUser,
  updateProfilePictureUser,
  getProfilePictureUser,
  newPaymentByUser,
  sendStripePublishableKey
} from "../controllers/user.controller";

import { isAuthenticatedUserLogin } from "../middleware/auth";
import { updateUserAccessToken } from "../middleware/updatetoken";



const userRouter = express.Router();

userRouter.post("/user/registration", registrationUser);

userRouter.post("/user/activate-user", activateUser);

userRouter.post("/user/login", loginUser);

userRouter.get("/user/logout", isAuthenticatedUserLogin, logoutUser);

userRouter.get("/user/me", isAuthenticatedUserLogin, getUserInfo);

userRouter.put("/user/update-user-info",isAuthenticatedUserLogin, updateUserInfo);

userRouter.post("/user/update-access-token",updateUserAccessToken);

userRouter.post("/user/create-appointment",isAuthenticatedUserLogin,createAppointment);

userRouter.get("/user/get-medical-record", isAuthenticatedUserLogin, getMedicalRecordByUser);

userRouter.get("/user/get-all-dentists", isAuthenticatedUserLogin, getAllDentistsByUser);

userRouter.get("/user/get-all-dentists-schedules", isAuthenticatedUserLogin, getAllDentistsScheduleByUser);

userRouter.post("/user/sendEmail-reset-password", isAuthenticatedUserLogin, sendResetPasswordEmail);

userRouter.put("/user/reset-password", isAuthenticatedUserLogin, ResetPasswordByUser);

userRouter.put("/user/update-profile-picture", isAuthenticatedUserLogin, updateProfilePictureUser);

userRouter.get("/user/get-profile-picture", isAuthenticatedUserLogin, getProfilePictureUser);

userRouter.get("/user/payment/stripepublishablekey", sendStripePublishableKey);

userRouter.post("/user/payment", isAuthenticatedUserLogin, newPaymentByUser);

export default userRouter;