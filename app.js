const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: "67f16864ec81e1549d9aa63d", // paste the _id of the test user created in the previous step
  };
  next();
});

// connect to the MongoDB server
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error); // .catch((e) => console.error(e)); is an equivilent expression

app.use(express.json()); // middleware: put before router
app.use("/", mainRouter); // if requests are sent to root, then send them to the userRouter

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
