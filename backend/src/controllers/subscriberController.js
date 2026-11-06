import bcrypt from "bcryptjs";
import Customer from "../models/Subscriber.js";
import Subscriber from "../models/Subscriber.js";

export const createSubscriber = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Subscriber already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const subscriber = await Subscriber.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.json({
      success: true,
      message: "Subscriber created successfully",
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSubscribers = async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  res.json({ success: true, data: subscribers });
};

export const getSubscriberById = async (req, res) => {
  const subscriber = await Subscriber.findById(req.params.id);
  res.json({ success: true, data: subscriber });
};

export const updateSubscriber = async (req, res) => {
  const subscriber = await Subscriber.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.json({ success: true, data: subscriber });
};
