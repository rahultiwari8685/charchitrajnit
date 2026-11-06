import express from "express";
import {
    createSubscription,
    getSubscriptionByCustomer
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/saveSubscription", createSubscription);
router.get("/customer/:customerId", getSubscriptionByCustomer);

export default router;
