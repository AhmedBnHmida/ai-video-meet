import express from "express";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  getApplicationsByUserId, 
  updateApplication,
  deleteApplication,
} from "../Controllers/applicationController";

const router = express.Router();

// 📌 CREATE a new application
router.post("/Add", createApplication);

// 📌 READ all applications or by ID/user
router.get("/GetAll", getAllApplications);
router.get("/GetById/:id", getApplicationById);
router.get("/GetByUser/:userId", getApplicationsByUserId);

// 📌 UPDATE an application
router.put("/Update/:id", updateApplication);

// 📌 DELETE an application
router.delete("/Delete/:id", deleteApplication);

export default router;
