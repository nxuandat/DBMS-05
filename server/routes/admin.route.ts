import express from "express";
import {
  GetAllEmployee,
  getAdminInfo,
  getAllRevenue,
  getAllUsers,
  getAppointmentsAnalytics,
  getInvoicesAnalytics,
  getUsersAnalytics,
  loginAdmin,
  logoutAdmin,
} from "../controllers/admin.controller";

import { isAuthenticatedAdminLogin } from "../middleware/auth";
import { getAllDentistByAdminService } from "../services/admin.service";


const adminRouter = express.Router();

adminRouter.post("/admin/login", loginAdmin);

adminRouter.get("/admin/get-all-users", isAuthenticatedAdminLogin, getAllUsers);

adminRouter.get("/admin/get-all-dentists", isAuthenticatedAdminLogin,getAllDentistByAdminService);

adminRouter.get("/admin/get-all-employees", isAuthenticatedAdminLogin,GetAllEmployee);

adminRouter.get("/admin/logout", isAuthenticatedAdminLogin, logoutAdmin);

adminRouter.get("/admin/me", isAuthenticatedAdminLogin, getAdminInfo);

adminRouter.get("/admin/get-users-analytics", isAuthenticatedAdminLogin, getUsersAnalytics);

adminRouter.get("/admin/get-invoices-analytics", isAuthenticatedAdminLogin, getInvoicesAnalytics);

adminRouter.get("/admin/get-appointments-analytics", isAuthenticatedAdminLogin, getAppointmentsAnalytics);

adminRouter.get("/admin/get-revenue-analytics", isAuthenticatedAdminLogin, getAllRevenue);

export default adminRouter;