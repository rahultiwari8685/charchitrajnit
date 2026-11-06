import express from "express";
import {
  saveUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
  getUserDetailsById,
  getUserById,
} from "../controllers/userController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/saveUser", upload.single("profileImage"), saveUser);
router.post("/updateUser", upload.single("profileImage"), updateUser);
router.post("/change-password", changePassword);

router.get("/getAllUser", getAllUsers);

router.post("/deleteUser/:_id", deleteUser);
router.get("/getUserDetailsById/:id", getUserDetailsById);
router.get("/getUserById/:id", getUserById);

export default router;
