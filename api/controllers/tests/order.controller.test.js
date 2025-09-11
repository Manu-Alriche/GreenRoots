import { describe, it, jest, beforeEach } from "@jest/globals";
import { createOrder } from "../order.controller.js";
import * as OrderModule from "../../models/order.model.js";
import * as OrderItemModule from "../../models/orderItem.model.js";

describe("Service - createOrder (isolé avec spyOn)", () => {
  let user;
  let trees;

  beforeEach(() => {
    user = { id: 1 };
    trees = [
      { id: 2, name: "Chêne", stock: 5, price: 20, update: jest.fn() },
      { id: 5, name: "Érable", stock: 10, price: 30, update: jest.fn() },
    ];

    // Mock uniquement la méthode create
    jest
      .spyOn(OrderModule.Order, "create")
      .mockResolvedValue({ id: 1, update: jest.fn() });
    jest.spyOn(OrderItemModule.OrderItem, "create").mockResolvedValue({});
  });

  afterEach(() => {
    // Restore les mocks pour ne pas interférer avec les autres tests
    jest.restoreAllMocks();
  });

  it("crée une commande et met à jour le stock", async () => {
    const items = [
      { tree: trees[0], quantity: 1 },
      { tree: trees[1], quantity: 2 },
    ];

    const order = await createOrder(user, items, {
      firstname: "Jean",
      lastname: "Dupont",
      localisation: "Paris",
      note: "Livrer rapidement",
    });

    expect(OrderModule.Order.create).toHaveBeenCalled();
    expect(OrderItemModule.OrderItem.create).toHaveBeenCalledTimes(2);
    expect(trees[0].update).toHaveBeenCalledWith({ stock: 4 });
    expect(trees[1].update).toHaveBeenCalledWith({ stock: 8 });
    expect(order.update).toHaveBeenCalledWith({ total: 80 });
  });

  it("lance une erreur si le stock est insuffisant", async () => {
    const items = [{ tree: { ...trees[0], stock: 0 }, quantity: 1 }];

    await expect(
      createOrder(user, items, { firstname: "Jean" })
    ).rejects.toThrow("Stock insuffisant pour l’arbre Chêne");
  });
});
