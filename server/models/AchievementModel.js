import mongoose, { Schema } from "mongoose";

const achievementSchema = new Schema(
  {
    name: { type: String, required: true },
    tasksRequired: { type: Number, required: true }
  },
  { timestamps: true }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
