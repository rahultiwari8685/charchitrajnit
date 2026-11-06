import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        plan_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            required: true
        },

        start_date: {
            type: Date,
            required: true
        },

        end_date: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active"
        }
    },
    { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
