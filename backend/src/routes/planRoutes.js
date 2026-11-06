import express from "express";
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  togglePlanStatus,
} from "../controllers/planController.js";

const router = express.Router();

router.get("/getAllPlans", getPlans);
router.post("/savePlan", createPlan);
router.patch("/toggle/:id", togglePlanStatus);

router.get("/:id", getPlanById);
router.put("/:id", updatePlan);

export default router;
