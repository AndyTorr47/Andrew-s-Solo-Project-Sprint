const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end);

//GET /api/topics

describe("/api/topics tests", () => {
  test("/api/topics, returns an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        topics.forEach((topic) =>
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          )
        );
      });
  });
  test(`404 - Path not found for /api/topic`, () => {
    return request(app)
      .get("/api/topi")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

//GET /api/articles/:article_id

describe("GET /api/articles tests", () => {
  test("/api/articles, returns an array of objects from the given properties ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles);
        articles.forEach((article) =>
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          )
        );

        expect(articles.length).toBe(12);
      });
  });
  test("should return a 404 not found if the article_id does not exist", () => {
    return request(app)
      .get(`/api/articles/135983`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

//PATCH /api/articles/:article_id

describe("PATCH /api/articles/:article_id", () => {
  test("should return a 404 not found if the article_id does not exist", () => {
    return request(app)
      .patch(`/api/articles/112358`)
      .send({ inc_votes: 1 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });

  test("should return a 400 bad request if not given inc_votes", () => {
    return request(app)
      .patch(`/api/articles/3`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("inc_votes is required");
      });
  });

  test("should return a 201 and the updated article if exists and valid data is passed", () => {
    return request(app)
      .patch(`/api/articles/3`)
      .send({ inc_votes: 3 })
      .expect(201)
      .then((res) => {
        expect(res.body.article).toBeInstanceOf(Object);
        expect(res.body.article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
        expect(res.body.article.votes).toBe(3);
      });
  });
});

// GET /api/users

describe(`GET /api/users tests`, () => {
  describe(`GET tests`, () => {
    test(`/api/users, returns an array of objects`, () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          users.forEach((user) =>
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            )
          );
          console.log(users);
          expect(users.length).toBe(4);
        });
    });
  });
});

// GET /api/articles/comment_count
