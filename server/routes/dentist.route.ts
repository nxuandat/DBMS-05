import express from "express";
import {
  loginDentist,
  logoutDentist
} from "../controllers/dentist.controller";

import { isAuthenticatedDentistLogin } from "../middleware/auth";


const dentistRouter = express.Router();

dentistRouter.post("/dentist/login", loginDentist);

dentistRouter.get("/dentist/logout", isAuthenticatedDentistLogin, logoutDentist);

export default dentistRouter;