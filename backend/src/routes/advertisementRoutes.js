import express from "express";
import upload from "../middlewares/upload.js";

import {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  changeStatus,
  getAdvertisementsByPosition,
  increaseView,
  increaseClick,
} from "../controllers/advertisementController.js";

const router = express.Router();

router.post("/create", upload.single("image"), createAdvertisement);

router.get("/", getAllAdvertisements);

router.get("/position/:position", getAdvertisementsByPosition);

router.post("/view/:id", increaseView);

router.post("/click/:id", increaseClick);

router.get("/:id", getAdvertisement);

router.put("/update/:id", upload.single("image"), updateAdvertisement);

router.patch("/status/:id", changeStatus);

router.delete("/delete/:id", deleteAdvertisement);

export default router;
