import express from "express";

import Incident from "../models/incident";

const router = express.Router();

router.post("/add", (req, res) => {
  const addedIncident = req.body;
  let newIncident = new Incident({
    incident: addedIncident.incident,
    incidentDescription: addedIncident.incidentDescription,
    severityLevel: addedIncident.severityLevel,
    affectedService: addedIncident.affectedService,
    reporter: addedIncident.reporter,
  });

  newIncident
    .save()
    .then((incident) => {
      res.status(200).json(incident._id.toString());
    })
    .catch((err) => {
      res
        .status(400)
        .json({ errors: { global: "Incident save failed, try again" } });
    });
});

router.get("/getincidents", (req, res) => {
  Incident.find({})
    .sort({ createdAt: 1 })
    .then((incidents) => {
      res.status(200).json(incidents);
    });
});

export default router;
