import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import compression from "compression";
import mongoose from "mongoose";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

app.listen(process.env.PORT, () => {
  console.log("server running on http://localhost:8080");
});
const username = encodeURIComponent(process.env.MONGO_DB_USERNAME);
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const MONGO_URL = `mongodb+srv://${username}:${password}@${process.env.MONGO_DB_CLUSTER}.w9fm9qn.mongodb.net/?retryWrites=true&w=majority&appName=nodebackend`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) =>
  console.log("Connection Error", error)
);
