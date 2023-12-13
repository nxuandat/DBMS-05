import express from "express";
import {
  GetAllEmployee,
  addDentist,
  addEmployee,
  addMedicineByAdmin,
  addUser,
  deleteDentist,
  deleteEmployee,
  deleteMedicineByAdmin,
  deleteUser,
  getAdminInfo,
  getAllMedicine,
  getAllRevenue,
  getAllUsers,
  getAppointmentsAnalytics,
  getInvoicesAnalytics,
  getUsersAnalytics,
  loginAdmin,
  logoutAdmin,
  updateDentistByAdmin,
  updateEmployeeByAdmin,
  updateMedicineByAdmin,
  updateUserByAdmin,
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

adminRouter.post("/admin/add-medicine", isAuthenticatedAdminLogin, addMedicineByAdmin);

adminRouter.delete("/admin/delete-medicine", isAuthenticatedAdminLogin, deleteMedicineByAdmin);

adminRouter.put("/admin/update-medicine", isAuthenticatedAdminLogin, updateMedicineByAdmin);

adminRouter.get("/admin/get-all-medicine", isAuthenticatedAdminLogin, getAllMedicine);

adminRouter.post("/admin/add-user", isAuthenticatedAdminLogin, addUser);

adminRouter.delete("/admin/delete-user", isAuthenticatedAdminLogin, deleteUser);

adminRouter.put("/admin/update-user", isAuthenticatedAdminLogin, updateUserByAdmin);

adminRouter.post("/admin/add-dentist", isAuthenticatedAdminLogin, addDentist);

adminRouter.delete("/admin/delete-dentist", isAuthenticatedAdminLogin, deleteDentist);

adminRouter.put("/admin/update-dentist", isAuthenticatedAdminLogin, updateDentistByAdmin);

adminRouter.delete("/admin/delete-employee", isAuthenticatedAdminLogin, deleteEmployee);

adminRouter.put("/admin/update-employee", isAuthenticatedAdminLogin, updateEmployeeByAdmin);

adminRouter.post("/admin/add-employee", isAuthenticatedAdminLogin, addEmployee);

export default adminRouter;