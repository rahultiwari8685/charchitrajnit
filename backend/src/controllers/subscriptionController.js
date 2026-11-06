import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";
import mongoose from "mongoose";

// export const createSubscription = async (req, res) => {
//     const { customer_id, plan_id } = req.body;

//     const plan = await Plan.findById(plan_id);

//     const start = new Date();
//     const end = new Date();

//     if (plan.billing_cycle === "monthly") {
//         end.setMonth(end.getMonth() + 1);
//     } else {
//         end.setFullYear(end.getFullYear() + 1);
//     }

//     const subscription = await Subscription.create({
//         customer_id,
//         plan_id,
//         start_date: start,
//         end_date: end
//     });

//     res.json({ success: true, data: subscription });
// };

export const createSubscription = async (req, res) => {
  try {
    const { customer_id, plan_id } = req.body;

    // ✅ Validate input
    if (!customer_id || !plan_id) {
      return res.status(400).json({
        success: false,
        message: "customer_id and plan_id are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(customer_id) ||
      !mongoose.Types.ObjectId.isValid(plan_id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid IDs",
      });
    }

    // ✅ Fetch plan
    const plan = await Plan.findById(plan_id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // ✅ Prevent duplicate active subscription
    const existing = await Subscription.findOne({
      customer_id,
      status: "active",
      end_date: { $gte: new Date() },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Active subscription already exists",
      });
    }

    // ✅ Date logic
    const start = new Date();
    const end = new Date();

    if (plan.billing_cycle === "monthly") {
      end.setMonth(end.getMonth() + 1);
    } else {
      end.setFullYear(end.getFullYear() + 1);
    }

    // ✅ Create subscription
    const subscription = await Subscription.create({
      customer_id,
      plan_id,
      start_date: start,
      end_date: end,
      status: "active",
    });

    res.json({
      success: true,
      data: subscription,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// export const getSubscriptionByCustomer = async (req, res) => {
//     const subscription = await Subscription.findOne({
//         customer_id: req.params.customerId,
//         status: "active"
//     }).populate("plan_id");

//     res.json({ success: true, data: subscription });
// };

export const getSubscriptionByCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const subscription = await Subscription.findOne({
      customer_id: customerId,
      status: "active",
      end_date: { $gte: new Date() },
    }).populate("plan_id");

    if (!subscription) {
      return res.json({
        success: true,
        data: null,
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
