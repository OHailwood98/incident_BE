import express from "express";
import decode from "jwt-decode";

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

router.post("/getincident", (req, res) => {
  var { id } = req.body;
  Incident.findById(id)
    .then((incident) => {
      res.status(200).json({ incident: incident });
    })
    .catch((err) => {
      res.status(400).json({ errors: err });
    });
});

router.post("/addmessage", (req, res) => {
  console.dir(req.headers.authorisation);
  var { id, message } = req.body;
  var { username } = decode(req.headers.authorisation);
  var time = Date.now();
  var newMessage = {
    name: username,
    message: message,
    added: time,
  };
  Incident.findById(id)
    .then((incident) => {
      var messages = incident.messages;
      messages.push(newMessage);
      incident.messages = messages;
      incident
        .save()
        .then((savedIncident) => {
          res.status(200).json({ incident: savedIncident });
        })
        .catch((err) => {
          res.status(400).json({ errors: err });
        });
    })
    .catch((err) => {
      res.status(400).json({ errors: err });
    });
});

export default router;
