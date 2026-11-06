import express from "express";
import upload from "../middlewares/upload.js";

import {
  saveSiteSetting,
  getSiteSetting,
  deleteHeaderLogo,
  deleteFooterLogo,
  deleteFavicon,
} from "../controllers/SiteSettingController.js";

const router = express.Router();

router.get("/", getSiteSetting);

router.post(
  "/save",
  upload.fields([
    { name: "headerLogo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  saveSiteSetting,
);

router.delete("/header-logo", deleteHeaderLogo);
router.delete("/footer-logo", deleteFooterLogo);
router.delete("/favicon", deleteFavicon);

export default router;
