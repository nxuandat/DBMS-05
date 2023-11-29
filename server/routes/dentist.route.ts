import express from "express";
import {
  getProfilePictureDentist,
  loginDentist,
  logoutDentist,
  updateProfilePictureDentist
} from "../controllers/dentist.controller";

import { isAuthenticatedDentistLogin } from "../middleware/auth";


const dentistRouter = express.Router();

dentistRouter.post("/dentist/login", loginDentist);

dentistRouter.put("/dentist/update-profile-picture", isAuthenticatedDentistLogin, updateProfilePictureDentist);

dentistRouter.get("/dentist/get-profile-picture", isAuthenticatedDentistLogin, getProfilePictureDentist);

dentistRouter.get("/dentist/logout", isAuthenticatedDentistLogin, logoutDentist);

export default dentistRouter;