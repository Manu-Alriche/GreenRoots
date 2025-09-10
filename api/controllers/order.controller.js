import { StatusCodes } from "http-status-codes";
import { Order, Tree, OrderItem, User } from "../models/index.js";

export async function getAll(req, res) {
  try {
    const userId = req.userId;
    const orders = await Order.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Tree,
          as: "trees",
          through: { attributes: ["quantity"] },
        },
      ],
    });
    if (!orders) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Commandes introuvable" });
    }
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erreur lors de la récupération des commandes",
      error: error.message,
    });
  }
}

export async function getByReference(req, res) {
  try {
    const order = await Order.findOne({
      where: {
        reference: req.params.reference,
        user_id: req.userId, // Assure que l'utilisateur ne peut voir que ses propres commandes
      },
      include: [
        {
          model: Tree,
          as: "trees",
          through: { attributes: ["quantity"] },
        },
      ],
    });
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Commande introuvable" });
    }
    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erreur lors de la récupération de la commande",
      error: error.message,
    });
  }
}

export async function createOrder(user, items, clientInfo = {}) {
  const { firstname, lastname, localisation, note } = clientInfo;
  const order = await Order.create({
    user_id: user.id,
    firstname,
    lastname,
    localisation,
    note,
  });
  let total = 0;
  for (const { tree, quantity } of items) {
    if (tree.stock < quantity) {
      throw new Error(`Stock insuffisant pour l’arbre ${tree.name}`);
    }
    await OrderItem.create({
      order_id: order.id,
      tree_id: tree.id,
      quantity,
    });
    await tree.update({ stock: tree.stock - quantity });
    total += tree.price * quantity;
  }
  await order.update({ total });
  return order;
}

export async function create(req, res) {
  try {
    const { userId, items, firstname, lastname, localisation, note } = req.body;

    if (!userId || !Array.isArray(items)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "userId et items requis" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }
    const treeIds = items.map((i) => i.treeId);
    const trees = await Tree.findAll({ where: { id: treeIds } });

    if (trees.length !== items.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Arbre introuvable" });
    }
    const mappedItems = items.map((item) => {
      const tree = trees.find((t) => t.id === item.treeId);
      return { tree, quantity: item.quantity };
    });

    const order = await createOrder(user, mappedItems, {
      firstname,
      lastname,
      localisation,
      note,
    });

    return res.status(StatusCodes.CREATED).json(order);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Erreur lors de la création de la commande",
      error: error.message,
    });
  }
}
