import express from "express";
import {
  loginEmployee,
  logoutEmployee
} from "../controllers/employee.controller";

import { isAuthenticatedEmployeeLogin } from "../middleware/auth";


const employeeRouter = express.Router();

employeeRouter.post("/employee/login", loginEmployee);

employeeRouter.get("/employee/logout", isAuthenticatedEmployeeLogin, logoutEmployee);

export default employeeRouter;