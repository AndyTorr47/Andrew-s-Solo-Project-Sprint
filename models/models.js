const { rows } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticles = (sort_by = "created_at", order = "DESC") => {
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
                     ORDER BY ${sort_by} ${order};`
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

exports.theComment = (article_id, username, comment) => {
  let query = ` 
        INSERT INTO comments
        (article_id, author, body)
        VALUES ($1, $2, $3) RETURNING author AS username, body;
    `;

  return db.query(query, [article_id, username, comment]).then((result) => {
    //when body only contains white spaces
    if (comment.length >= 0 && !comment.match(/\w/gi)) {
      return Promise.reject({
        status: 400,
        msg: "can not post a comment with only white spaces",
      });
    }

    return result.rows[0];
  });
};

exports.deleteCommentById = (comment_id) => {
  let query = ` 
        DELETE FROM comments
        WHERE comment_id = $1
    `;

  return db.query(query, [comment_id]).then((result) => {
    return result.rows;
  });
};
