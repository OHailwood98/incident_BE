import express from "express";

import incident from "../models/incident";

const router = express.Router();

router.post("/add", (req, res) => {
  const addedIncident = req.body;
  let newIncident = new incident({
    incident: addedIncident.incident,
    incidentDescription: addedIncident.incidentDescription,
    severityLevel: addedIncident.severityLevel,
    affectedService: addedIncident.affectedService,
    reporter: addedIncident.reporter,
  });

  newIncident
    .save()
    .then((incident) => {
      res.status(200).json({ id: incident._id.toString() });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ errors: { global: "Incident save failed, try again" } });
    });
});

export default router;
