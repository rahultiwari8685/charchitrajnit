import Plan from "../models/Plan.js";


export const createPlan = async (req, res) => {
    try {
        const {
            name,
            price,
            billing_cycle,
            report_limit,
            features
        } = req.body;


        if (!name || price === undefined || !billing_cycle || !report_limit) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        const plan = await Plan.create({
            name,
            price,
            billing_cycle,
            report_limit,
            features
        });

        res.status(201).json({
            success: true,
            message: "Plan created successfully",
            data: plan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: plans
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        res.json({
            success: true,
            data: plan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        Object.assign(plan, req.body);
        await plan.save();

        res.json({
            success: true,
            message: "Plan updated successfully",
            data: plan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const togglePlanStatus = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        plan.is_active = !plan.is_active;
        await plan.save();

        res.json({
            success: true,
            message: "Plan status updated",
            data: plan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
