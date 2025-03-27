const request = require("supertest");
const app = require("../app");
const mongoose = require('mongoose');
const { Group } = require("../src/models/Group/Group");

const testGroupName = "TEST GROUP";

describe("Group API", () => {

});

afterAll(async () => {
  await mongoose.connection.close();
});