import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    incident: { type: String, required: true },
    incidentDescription: { type: String, required: true },
    severityLevel: { type: String, required: true },
    affectedService: { type: String, required: true },
    reporter: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("incident", schema);
