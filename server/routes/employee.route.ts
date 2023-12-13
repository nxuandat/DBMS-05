import express from "express";
import {
  loginEmployee,
  logoutEmployee,
  getAllUsers,
  getEmployeeInfo,
  addMedicineForEmployee,
  deleteMedicineForEmployee,
  getMedicineForEmployee,
  updateMedicineForEmployee,
  getExpiredMedicineForEmployee
} from "../controllers/employee.controller";

import { isAuthenticatedEmployeeLogin } from "../middleware/auth";


const employeeRouter = express.Router();

employeeRouter.post("/employee/login", loginEmployee);

employeeRouter.get("/employee/logout", isAuthenticatedEmployeeLogin, logoutEmployee);

employeeRouter.get("/employee/me", isAuthenticatedEmployeeLogin, getEmployeeInfo);

employeeRouter.get("/employee/get-all-users", isAuthenticatedEmployeeLogin, getAllUsers);

employeeRouter.post("/employee/add-medicine", isAuthenticatedEmployeeLogin, addMedicineForEmployee);

employeeRouter.delete("/employee/delete-medicine/:MaThuoc", isAuthenticatedEmployeeLogin, deleteMedicineForEmployee);

employeeRouter.get("/employee/get-medicine/:MaThuoc", isAuthenticatedEmployeeLogin, getMedicineForEmployee);

employeeRouter.put("/employee/update-medicine/:MaThuoc", isAuthenticatedEmployeeLogin, updateMedicineForEmployee);

employeeRouter.get("/employee/get-expired-medicine", isAuthenticatedEmployeeLogin, getExpiredMedicineForEmployee);
export default employeeRouter;