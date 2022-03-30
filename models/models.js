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
      `UPDATE articles SET votes = votes + ${inc_votes} WHERE article_id = ${article_id} RETURNING *;`
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ msg: "Route not found", status: 404 });
      }
      return result.rows[0];
    });
};
