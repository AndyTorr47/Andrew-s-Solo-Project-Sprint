const {
  selectTopics,
  selectArticles,
  patchArticle,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined) {
    return next({ status: 400, msg: "inc_votes is required" });
  }
  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "inc_votes must be an integar" });
  }

  patchArticle(article_id, inc_votes)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
