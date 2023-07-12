import supertest from "supertest";
import app from "../src/app";

const server = supertest(app);

const FRUIT_BODY_SAMPLE = {
  name: "amora",
  price: 1.0,
};
const FRUIT_BODY_SAMPLE_ID_AFTER_INSERT = 1;
const FRUIT_BODY_SAMPLE_MISSING_DATA_A = {
  name: "amora",
};
const FRUIT_BODY_SAMPLE_MISSING_DATA_B = {
  price: 1.0,
};
const INEXISTANT_FRUIT_EXAMPLE_ID = 1000;
const INVALID_FRUIT_PARAM_EXAMPLE = "amora";

describe("POST /fruits", () => {
  it("should return 201 when inserting a fruit", async () => {
    const insertFruit = await server.post("/fruits").send(FRUIT_BODY_SAMPLE);
    expect(insertFruit.status).toEqual(201);
  });

  it("should return 409 when inserting a fruit that exists already", async () => {
    const fruitConflict = await server.post("/fruits").send(FRUIT_BODY_SAMPLE);
    expect(fruitConflict.status).toEqual(409);
  });

  it("should return 422 when missing a info", async () => {
    const fruitWithoutPrice = await server
      .post("/fruits")
      .send(FRUIT_BODY_SAMPLE_MISSING_DATA_A);
    expect(fruitWithoutPrice.status).toEqual(422);
  });
  it("should return 422 when missing a info", async () => {
    const fruitWithoutPrice = await server
      .post("/fruits")
      .send(FRUIT_BODY_SAMPLE_MISSING_DATA_B);
    expect(fruitWithoutPrice.status).toEqual(422);
  });
});

describe("GET /fruits", () => {
  it("should return 404 when a fruit doesn't exist", async () => {
    const { statusCode } = await server.get(
      `/fruits/${INEXISTANT_FRUIT_EXAMPLE_ID}`
    );
    expect(statusCode).toBe(404);
  });

  it("should return 400 when id params is not valid", async () => {
    const { statusCode } = await server.get(
      `/fruits/${INVALID_FRUIT_PARAM_EXAMPLE}`
    );
    expect(statusCode).toBe(400);
  });

  it("should return a fruit with given id", async () => {
    const { body } = await server.get(
      `/fruits/${FRUIT_BODY_SAMPLE_ID_AFTER_INSERT}`
    );
    expect(body).toEqual({
      name: "amora",
      price: 1.0,
    });
  });

  it("should return all fruits", async () => {
    const { body } = await server.get("/fruits");
    expect(body).toHaveLength(1);
  });
});
