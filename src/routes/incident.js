import express from "express";

const router = express.Router();

router.post("/add", (req, res) => {
  console.dir(req.body);
  res.status(500).json({ err: "its fucked" });
});

export default router;
