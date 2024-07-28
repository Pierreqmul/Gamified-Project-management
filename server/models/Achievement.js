import mongoose, { Schema } from "mongoose";

const achievementSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true },
  taskThreshold: { type: Number, required: true }
});

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
