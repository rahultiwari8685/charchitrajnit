import Poll from "../models/Poll.js";
import PollVote from "../models/PollVote.js";
import Customer from "../models/Customer.js";

export const createPoll = async (req, res) => {
  try {
    const { question, options, start_date, end_date, show_result } = req.body;

    if (
      !question ||
      !options ||
      options.length < 2 ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Question, at least 2 options, start date and end date are required",
      });
    }

    const poll = await Poll.create({
      question,
      options,
      start_date,
      end_date,

      // Make newly created poll active
      status: "active",

      show_result: show_result !== undefined ? show_result : true,
    });

    return res.status(201).json({
      success: true,
      message: "Poll created successfully",
      data: poll,
    });
  } catch (error) {
    console.error("Create Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: polls,
    });
  } catch (error) {
    console.error("Get All Polls Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    return res.json({
      success: true,
      message: "Poll updated successfully",
      data: poll,
    });
  } catch (error) {
    console.error("Update Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    // Delete all votes associated with this poll
    await PollVote.deleteMany({ poll_id: poll._id });

    // Delete the poll
    await Poll.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Poll deleted successfully",
    });
  } catch (error) {
    console.error("Delete Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete poll",
    });
  }
};

export const getPollVoters = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findById(id).lean();

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    const votes = await PollVote.find({
      poll_id: poll._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const customerIds = votes.map((vote) => vote.customer_id);

    const subscribers = await Customer.find({
      _id: { $in: customerIds },
    })
      .select("name email phone")
      .lean();

    const subscriberMap = new Map(
      subscribers.map((subscriber) => [String(subscriber._id), subscriber]),
    );

    const voters = votes.map((vote) => {
      const subscriber = subscriberMap.get(String(vote.customer_id));

      return {
        vote_id: vote._id,
        customer_id: vote.customer_id,
        name: subscriber?.name || "Unknown voter",
        email: subscriber?.email || "",
        phone: subscriber?.phone || "",
        option_index: vote.option_index,
        option_text:
          poll.options?.[vote.option_index]?.text || "Unknown option",
        voted_at: vote.createdAt || null,
      };
    });

    return res.json({
      success: true,
      data: {
        poll: {
          _id: poll._id,
          question: poll.question,
          options: poll.options,
        },
        totalVoters: voters.length,
        voters,
      },
    });
  } catch (error) {
    console.error("Get Poll Voters Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch poll voters",
    });
  }
};
