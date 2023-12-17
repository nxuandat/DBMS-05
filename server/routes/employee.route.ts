import express from "express";
import {
  createAppointmentByEmployee,
  createInvoiceByEmployee,
  deleteAppointment,
  deleteInvoice,
  getAllAppointment,
  getAllInvoices,
  getEmployeeInfo,
  loginEmployee,
  logoutEmployee,
  updateAppointment,
  updateInvoice
} from "../controllers/employee.controller";

import { isAuthenticatedEmployeeLogin } from "../middleware/auth";


const employeeRouter = express.Router();

employeeRouter.post("/employee/login", loginEmployee);

employeeRouter.get("/employee/logout", isAuthenticatedEmployeeLogin, logoutEmployee);

employeeRouter.get("/employee/me", isAuthenticatedEmployeeLogin, getEmployeeInfo);

employeeRouter.post("/employee/create-appointment", isAuthenticatedEmployeeLogin, createAppointmentByEmployee);

employeeRouter.get("/employee/get-all-appointments", isAuthenticatedEmployeeLogin, getAllAppointment);

employeeRouter.get("/employee/get-all-invoices", isAuthenticatedEmployeeLogin, getAllInvoices);

employeeRouter.put("/employee/update-appointment", isAuthenticatedEmployeeLogin, updateAppointment);

employeeRouter.delete("/employee/delete-appointment", isAuthenticatedEmployeeLogin, deleteAppointment);

employeeRouter.delete("/employee/delete-invoice", isAuthenticatedEmployeeLogin, deleteInvoice);

employeeRouter.post("/employee/create-invoice", isAuthenticatedEmployeeLogin, createInvoiceByEmployee);

employeeRouter.put("/employee/update-invoice", isAuthenticatedEmployeeLogin, updateInvoice);

export default employeeRouter;