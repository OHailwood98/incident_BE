import express from "express";

import User from "../models/user";

const router = express.Router();

router.post("/signup", (req, res) => {
  const { credentials } = req.body;
  const user = new User({
    email: credentials.email,
    username: credentials.username,
  });

  user.setPassword(credentials.password);
  user.setConfirmToken();
  user
    .save()
    .then((user) => {
      sendConfirmEmail(user);
      res.status(200).json({ user: user.toAuthJson() });
    })
    .catch((err) => res.status(400).json({ errors: err.errors }));
});

router.post("/login", (req, res) => {
  const { credentials } = req.body;
  User.findOne({ email: credentials.email }).then((user) => {
    if (user && user.passwordCheck(credentials.password)) {
      res.status(200).json({ user: user.toAuthJson() });
    } else {
      res
        .status(400)
        .json({ errors: { global: "Password Incorrect or User Not Found" } });
    }
  });
});

export default router;
