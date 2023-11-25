import express from "express";
import {
  GetAllEmployee,
  getAdminInfo,
  getAllUsers,
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

export default adminRouter;