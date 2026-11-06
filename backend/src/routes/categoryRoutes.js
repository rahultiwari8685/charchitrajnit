import upload from "../middlewares/upload.js";

import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getMenuCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/saveCategory", upload.single("bannerImage"), createCategory);
router.get("/getAllCategory", getAllCategories);
router.post("/updateCategory", upload.single("bannerImage"), updateCategory);
router.post("/deleteCategory", deleteCategory);
router.get("/menu", getMenuCategories);

export default router;
