import express from "express";
import {
  saveToken,
  testNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/save-token", saveToken);

router.get("/test", testNotification);

export default router;
