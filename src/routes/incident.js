import express from "express";
import decode from "jwt-decode";

import Incident from "../models/incident";

const router = express.Router();

router.post("/add", (req, res) => {
  var auth = {};
  var email = "";
  try {
    auth = decode(req.headers.authorisation);
    email = auth.email;
  } catch (err) {
    res.status(400).json({ errors: "Authorisation Error" });
  }
  const addedIncident = req.body;
  let newIncident = new Incident({
    incident: addedIncident.incident,
    incidentDescription: addedIncident.incidentDescription,
    severityLevel: addedIncident.severityLevel,
    affectedService: addedIncident.affectedService,
    reporter: email,
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

router.post("/deleteincident", (req, res) => {
  var { id } = req.body;
  var { role } = decode(req.headers.authorisation).catch((err) => {
    res.status(400).json({ errors: "Authorisation Error" });
  });
  if (role !== "ADM") {
    res.status(400).json({ errors: "Authorisation Error" });
  }
  Incident.findOneAndDelete({ _id: id })
    .then((incident) => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).json({ errors: err });
    });
});

router.post("/addmessage", (req, res) => {
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

router.post("/changestatus", (req, res) => {
  var { id, status } = req.body;
  var auth = {};
  var role = "";
  try {
    auth = decode(req.headers.authorisation);
    role = auth.role;
  } catch (err) {
    res.status(400).json({ errors: "Authorisation Error" });
  }
  if (role === "ADM") {
    Incident.findById(id).then((incident) => {
      incident.status = status;
      incident
        .save()
        .then((savedIncident) => {
          console.dir(savedIncident);
          res.status(200).json(savedIncident);
        })
        .catch((err) => {
          res.status(400).json({ errors: err });
        });
    });
  } else {
    res.status(400).json({ errors: "Authorisation Error" });
  }
});

export default router;
