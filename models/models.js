const { rows } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      `    SELECT  A.author,
                        A.title,
                        A.article_id,
                        A.topic,
                        A.created_at,
                        A.votes,
                        COUNT(B.article_id) :: INT  AS comment_count
                    FROM    articles A
                    LEFT JOIN comments B ON A.article_id=A.article_id
                    GROUP BY A.article_id
                     ORDER BY created_at DESC;`
    )
    .then((result) => {
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
      } else return result.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT username FROM users;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `    SELECT  A.author,
                        A.title,
                        A.article_id,
                        A.body,
                        A.topic,
                        A.created_at,
                        A.votes,
                        COUNT(B.article_id) :: INT AS comment_count
                FROM    articles A
                LEFT JOIN comments B ON A.article_id=A.article_id
                WHERE   A.article_id = $1
                GROUP BY A.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      const rest = rows[0];
      if (!rest) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      } else return rest;
    });
};

exports.selectArticleComments = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments
    WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comments not found`,
        });
      } else return rows;
    });
};
