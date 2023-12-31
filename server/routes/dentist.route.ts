import express from "express";
import {
  createDentistSchedule,
  createDetailMedicine,
  createMedicalRecord,
  deleteDentistSchedule,
  deleteDetailMedicine,
  deleteMedicalRecord,
  getAllDetailMedicineByDoctor,
  getAllMedicalRecord,
  getAllMedicineByDoctor,
  getAllServiceByDoctor,
  getAppointmentByDentist,
  getDentistInfo,
  getDentistsScheduleByDentist,
  getProfilePictureDentist,
  loginDentist,
  logoutDentist,
  updateDentistSchedule,
  updateDetailMedicine,
  updateProfilePictureDentist
} from "../controllers/dentist.controller";

import { isAuthenticatedDentistLogin } from "../middleware/auth";


const dentistRouter = express.Router();

dentistRouter.post("/dentist/login", loginDentist);

dentistRouter.get("/dentist/me", isAuthenticatedDentistLogin, getDentistInfo);

dentistRouter.put("/dentist/update-profile-picture", isAuthenticatedDentistLogin, updateProfilePictureDentist);

dentistRouter.get("/dentist/get-profile-picture", isAuthenticatedDentistLogin, getProfilePictureDentist);

dentistRouter.get("/dentist/logout", isAuthenticatedDentistLogin, logoutDentist);

dentistRouter.get("/dentist/get-all-medicines", isAuthenticatedDentistLogin, getAllMedicineByDoctor);

dentistRouter.get("/dentist/get-all-services", isAuthenticatedDentistLogin, getAllServiceByDoctor);

dentistRouter.get("/dentist/get-all-medicalrecords", isAuthenticatedDentistLogin, getAllMedicalRecord);

dentistRouter.post("/dentist/create-medicalrecord", isAuthenticatedDentistLogin, createMedicalRecord);

dentistRouter.delete("/dentist/delete-medicalrecord", isAuthenticatedDentistLogin, deleteMedicalRecord);

dentistRouter.get("/dentist/get-all-dentists-schedule", isAuthenticatedDentistLogin, getDentistsScheduleByDentist);

dentistRouter.post("/dentist/create-dentistschedule", isAuthenticatedDentistLogin, createDentistSchedule);

dentistRouter.delete("/dentist/delete-dentistschedule", isAuthenticatedDentistLogin, deleteDentistSchedule);

dentistRouter.put("/dentist/update-dentistschedule", isAuthenticatedDentistLogin, updateDentistSchedule);

dentistRouter.post("/dentist/create-detail-medicine", isAuthenticatedDentistLogin, createDetailMedicine);

dentistRouter.put("/dentist/update-detail-medicine", isAuthenticatedDentistLogin, updateDetailMedicine);

dentistRouter.delete("/dentist/delete-detail-medicine", isAuthenticatedDentistLogin, deleteDetailMedicine);

dentistRouter.get("/dentist/get-all-detail-medicine", isAuthenticatedDentistLogin, getAllDetailMedicineByDoctor);

dentistRouter.get("/dentist/get-appointment", isAuthenticatedDentistLogin, getAppointmentByDentist);

export default dentistRouter;