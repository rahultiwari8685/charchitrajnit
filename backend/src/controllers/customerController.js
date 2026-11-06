

import bcrypt from "bcryptjs";
import Customer from "../models/Customer.js";

export const createCustomer = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;


        const exists = await Customer.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Customer already exists",
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await Customer.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        res.json({
            success: true,
            message: "Customer created successfully",
            data: customer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getCustomers = async (req, res) => {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
};

export const getCustomerById = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    res.json({ success: true, data: customer });
};

export const updateCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json({ success: true, data: customer });
};
