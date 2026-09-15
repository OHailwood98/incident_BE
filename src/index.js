import express from "express";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Promise from "bluebird";
import helmet from "helmet";
import cors from "cors";

import incident from "./routes/incident";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
mongoose.Promise = Promise;
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => console.log("Connected!"));

app.use("/api/incident", incident);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8080, () => console.log("listening on 8080"));
