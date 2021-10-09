const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const db = require("./db");
const AuthRouter = require("./routers/auth");
const QuestionRouter = require("./routers/questionRoutes");

const app = express();
const apiPort = 3030;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use("/api", AuthRouter);
app.use("/question", QuestionRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
