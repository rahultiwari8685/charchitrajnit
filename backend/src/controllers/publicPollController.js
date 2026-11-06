import Poll from "../models/Poll.js";
import PollVote from "../models/PollVote.js";

export const getActivePoll = async (req, res) => {
  try {
    const now = new Date();

    const poll = await Poll.findOne({
      start_date: {
        $lte: now,
      },
      end_date: {
        $gte: now,
      },
      status: "active",
    }).lean();

    if (!poll) {
      return res.json({
        success: true,
        data: null,
      });
    }

    return res.json({
      success: true,
      data: poll,
    });
  } catch (error) {
    console.error("Get Active Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { option_index } = req.body;

    if (option_index === undefined) {
      return res.status(400).json({
        success: false,
        message: "Option required",
      });
    }

    if (!req.user || !req.user.customerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    const now = new Date();

    if (now < new Date(poll.start_date) || now > new Date(poll.end_date)) {
      return res.status(400).json({
        success: false,
        message: "Poll is not active",
      });
    }

    if (poll.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Poll is not active",
      });
    }

    if (option_index < 0 || option_index >= poll.options.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid option",
      });
    }

    // Check duplicate vote
    const existingVote = await PollVote.findOne({
      poll_id: poll._id,
      customer_id: req.user.customerId,
    });

    if (existingVote) {
      return res.status(409).json({
        success: false,
        message: "You have already voted",
      });
    }

    // Save vote
    await PollVote.create({
      poll_id: poll._id,
      customer_id: req.user.customerId,
      option_index,
    });

    // Increase option vote count
    await Poll.findByIdAndUpdate(poll._id, {
      $inc: {
        [`options.${option_index}.votes`]: 1,
      },
    });

    return res.json({
      success: true,
      message: "Vote submitted successfully",
    });
  } catch (error) {
    console.error("========== POLL VOTE ERROR ==========");

    console.error(error);

    console.error("======================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit vote",
    });
  }
};

export const pollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).lean();

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    const totalVotes = poll.options.reduce(
      (total, option) => total + Number(option.votes || 0),
      0,
    );

    const options = poll.options.map((option) => {
      const votes = Number(option.votes || 0);

      const percentage =
        totalVotes > 0 ? Number(((votes / totalVotes) * 100).toFixed(1)) : 0;

      return {
        ...option,
        votes,
        percentage,
      };
    });

    return res.json({
      success: true,
      data: {
        ...poll,
        totalVotes,
        options,
      },
    });
  } catch (error) {
    console.error("Poll Results Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
