import { describe, it, jest } from "@jest/globals";
import { getByReference } from "../product.controller.js";
import { Tree } from "../../models/tree.model.js";
import { sequelize } from "../../models/index.js";

describe("getByReference", () => {
  process.env.JWT_SECRET = "test_secret";
  it("should return a tree by reference", async () => {
    const req = {
      params: { reference: "tree123" },
      headers: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockTree = { reference: "tree123", name: "Oak" };
    jest.spyOn(Tree, "findOne").mockResolvedValue(mockTree);
    await getByReference(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTree);
  });

  it("should return 404 if tree not found", async () => {
    const req = {
      params: { reference: "nonexistent" },
      headers: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(Tree, "findOne").mockResolvedValue(null);
    await getByReference(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Arbre introuvable" });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
