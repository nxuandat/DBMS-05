import express from "express";
import {
  loginAdmin,
  logoutAdmin,
} from "../controllers/admin.controller";

import { isAuthenticatedAdminLogin } from "../middleware/auth";


const adminRouter = express.Router();

adminRouter.post("/admin/login", loginAdmin);

adminRouter.get("/admin/logout", isAuthenticatedAdminLogin, logoutAdmin);

export default adminRouter;