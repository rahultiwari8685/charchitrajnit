import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        billing_cycle: {
            type: String,
            required: true,
            enum: ["monthly", "yearly"]
        },

        report_limit: {
            type: String,
            required: true
        },

        features: {
            type: [String],
            default: []
        },

        is_active: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
