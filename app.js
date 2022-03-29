const express = require("express");
const { getTopics } = require("./controllers/controller");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");

const app = express();

app.use(express.json());

//api requests
app.get("/api/topics", getTopics);

//error handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
