const express = require("express");
const {
  getTopics,
  getArticles,
  getArticle,
  getArticleComments,
  updateArticleById,
  getUsers,
  postComment,
  deleteComment,
} = require("./controllers/controller");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");

const app = express();

app.use(express.json());

//api requests
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get(`/api/articles/:article_id`, getArticle);
app.get(`/api/articles/:article_id/comments`, getArticleComments);

app.patch("/api/articles/:article_id", updateArticleById);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

//error handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
