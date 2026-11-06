import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customerController.js";
import { getCustomerDashboard } from "../controllers/customerDashboardController.js";
import { verifySubscriber } from "../middlewares/authMiddleware.js";
import { getMyReports } from "../controllers/customerReportsController.js";
import { updateSubscriber } from "../controllers/subscriberController.js";

const router = express.Router();

router.get("/dashboard", verifySubscriber, getSubscriberDashboard);

router.post("/saveCustomer", createCustomer);
router.get("/getAllCustomer", getCustomers);
router.put("/updateCustomer/:id", updateSubscriber);

router.get("/my-reports", verifySubscriber, getMyReports);

export default router;
