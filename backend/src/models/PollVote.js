import mongoose from "mongoose";

const pollVoteSchema = new mongoose.Schema(
  {
    poll_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },

    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    option_index: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

pollVoteSchema.index(
  {
    poll_id: 1,
    customer_id: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("PollVote", pollVoteSchema);
