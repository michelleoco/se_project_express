const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();

const app = express();
const { PORT = 3001 } = process.env;

// connect to the MongoDB server
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// DELETE THIS CODE AFTER CODE REVIEW
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(cors());
app.use(express.json()); // middleware: put before router
app.use(requestLogger);
app.use("/", mainRouter); // if requests are sent to root, then send them to the userRouter
app.use(errorLogger); // enabling the error logger
app.use(errors()); // celebrate error handler
app.use(errorHandler); //centralized error handler

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
