const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticles = () => {
  return db.query(`SELECT * FROM articles`).then((result) => {
    return result.rows;
  });
};

exports.patchArticle = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ msg: "Route not found", status: 404 });
      }
      return result.rows[0];
    });
};
