import express from "express";
import {
  loginDentist,
  logoutDentist,
  getDentistInfo,
  getMedicalRecordByDentist,
  getScheduleForDentist,
  createScheduleDentist,
  deleteScheduleDentist
} from "../controllers/dentist.controller";

import { isAuthenticatedDentistLogin } from "../middleware/auth";


const dentistRouter = express.Router();

dentistRouter.get("/dentist/me", isAuthenticatedDentistLogin, getDentistInfo);

dentistRouter.get("/dentist/get-medical-record/:MaKH", isAuthenticatedDentistLogin, getMedicalRecordByDentist);

dentistRouter.get("/dentist/get-schedule", isAuthenticatedDentistLogin, getScheduleForDentist);

dentistRouter.post("/dentist/create-schedule", isAuthenticatedDentistLogin, createScheduleDentist);

dentistRouter.delete("/dentist/delete-schedule/:MaLich", isAuthenticatedDentistLogin, deleteScheduleDentist);

dentistRouter.post("/dentist/login", loginDentist);

dentistRouter.get("/dentist/logout", isAuthenticatedDentistLogin, logoutDentist);

export default dentistRouter;