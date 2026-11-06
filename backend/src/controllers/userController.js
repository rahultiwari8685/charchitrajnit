import User from "../models/User.js";
import bcrypt from "bcryptjs";

import mongoose from "mongoose";

export const saveUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      post_permission,
      user_status,
      bio,
      isVerified,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileImage = req.file ? req.file.filename : "";

    const user = await User.create({
      name,
      bio,
      email,
      phone,
      role,
      user_status,
      post_permission,
      password: hashedPassword,
      profileImage,
      isVerified: isVerified === "true" || isVerified === true,
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      id,
      name,
      email,
      phone,
      password,
      role,
      post_permission,
      user_status,
      bio,
      isVerified,
    } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
    }

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {
      name,
      email,
      phone,
      role,
      post_permission,
      user_status,
      bio,
    };

    if (isVerified !== undefined) {
      const value = String(isVerified).toLowerCase();

      if (value === "true" || value === "1") {
        updateData.isVerified = true;
      } else if (value === "false" || value === "0") {
        updateData.isVerified = false;
      } else {
        return res.status(400).json({
          success: false,
          message: "isVerified must be true or false",
        });
      }
    }

    // Update password only when a new password is provided.
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update profile image only when a new file is uploaded.
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// export const updateUser = async (req, res) => {
//   try {
//     const {
//       id,
//       name,
//       email,
//       phone,
//       password,
//       role,
//       post_permission,
//       user_status,
//     } = req.body;

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid user ID is required",
//       });
//     }

//     const existingUser = await User.findById(id);
//     if (!existingUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const updateData = {
//       name,
//       email,
//       phone,
//       password,
//       role,
//       post_permission,
//       user_status,
//     };

//     // ✅ Hash password if updated
//     if (password) {
//       updateData.password = await bcrypt.hash(password, 10);
//     }

//     // ✅ File update
//     if (req.file) {
//       updateData.profileImage = req.file.filename;
//     }

//     const updatedUser = await User.findByIdAndUpdate(id, updateData, {
//       new: true,
//     }).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

export const getUserDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
    }

    // Find user
    const user = await User.findById(id).select("-password");

    // Check user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { _id } = req.params;

    // if (!req.user || req.user.role !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Unauthorized",
    //   });
    // }

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
    }

    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword, userId } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
