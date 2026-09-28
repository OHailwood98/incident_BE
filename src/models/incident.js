import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    incident: { type: String, required: true },
    incidentDescription: { type: String, required: true },
    severityLevel: { type: String, required: true },
    affectedService: { type: String, required: true },
    reporter: { type: String, required: true },
    messages: [
      {
        name: String,
        message: String,
        added: Date,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("incident", schema);
