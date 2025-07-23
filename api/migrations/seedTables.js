import {
  Role,
  User,
  Tree,
  sequelize,
  EmailVerificationToken,
  PasswordResetToken,
} from "../models/index.js";
import { createOrder } from "../controllers/order.controller.js";
import { scrypt } from "../utils/scrypt.js";

// rajouter une vérification pour éviter les doublons
function generateReference() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

console.log("🚧 Seeding de la BDD Green Roots...");

console.log("🚧 Création roles...");
const adminRole = await Role.create({ name: "admin" });
const customerRole = await Role.create({ name: "customer" });

console.log("🚧 Création users...");
const adminUser = await User.create({
  firstName: "Alice",
  lastName: "Root",
  email: "admin@greenroots.com",
  password: await scrypt.hash("admin123"),
  role_id: adminRole.id,
});

const johnUser = await User.create({
  firstName: "John",
  lastName: "Doe",
  email: "john@greenroots.com",
  password: await scrypt.hash("password"),
  role_id: customerRole.id,
});

await adminUser.update({
  email_verified: true,
  email_verified_at: new Date(),
});

await johnUser.update({
  email_verified: true,
  email_verified_at: new Date(),
});

await EmailVerificationToken.create({
  user_id: adminUser.id,
  used: true,
});
await PasswordResetToken.create({
  user_id: adminUser.id,
});

await EmailVerificationToken.create({
  user_id: johnUser.id,
  used: true,
});
await PasswordResetToken.create({
  user_id: johnUser.id,
});

console.log("🚧 Création trees...");
const oak = await Tree.create({
  reference: generateReference(),
  name: "Chêne Pédonculé",
  description:
    "Le chêne est un arbre robuste aux feuilles lobées, apprécié pour son bois dur et ses glands nourrissant la faune.",
  price: 29.99,
  stock: 20,
  imageUrl: "987654321.jpg",
  status: "active"
});

const maple = await Tree.create({
  reference: generateReference(),
  name: "Erable",
  description:
    "L'érable est un arbre aux feuilles lobées qui changent de couleur en automne, célèbre pour sa sève sucrée utilisée pour le sirop d'érable.",
  price: 39.99,
  stock: 15,
  imageUrl: "123456789.jpg",
  status: "inactive", // Arbre inactif
  deactivatedAt: new Date()
});

const dragon = await Tree.create({
  reference: generateReference(),
  name: "Dragonier de Socotra",
  description:
    "Le dragonnier de Socotra a l'allure d'un grand parasol qui lorsqu'il est âgé peut atteindre la hauteur de 12 m avec une grosse tige robuste et un houppier très dense de tiges et de feuilles en forme de lance.",
  price: 199.99,
  stock: 5,
  imageUrl: "242668654.jpg",
  status: "active"
});

const bao = await Tree.create({
  reference: generateReference(),
  name: "Baobab",
  description:
    "Le Baobab est un arbre africain à caudex. Sacré pour plusieurs cultures, c'est aussi un arbre à palabres qu'il est malvenu ou sacrilège de couper.",
  price: 89.99,
  stock: 10,
  imageUrl: "458632178.jpg",
  status: "active"
});

const seq = await Tree.create({
  reference: generateReference(),
  name: "Sequoia Géant",
  description:
    "Endémique des montagnes de la Sierra Nevada en Californie, le Séquoia géant comprend les arbres les plus grands du monde en volume.",
  price: 99.99,
  stock: 10,
  imageUrl: "445632894.jpg",
  status: "active"
});

const ginkgo = await Tree.create({
  reference: generateReference(),
  name: "Ginkgo Biloba",
  description:
    "Le Ginkgo, aussi appelé arbre aux quarante écus, arbre aux mille écus, ou encore arbre aux abricots d'argent. En Chine, certains spécimens de cet arbre auraient une durée de vie excédant les 3 000 ans et plus de 100 individus auraient plus de 1 000 ans",
  price: 79.99,
  stock: 10,
  imageUrl: "445339852.jpg",
  status: "inactive"
});

const ban = await Tree.create({
  reference: generateReference(),
  name: "Banian",
  description:
    "Le Banian est un arbre imposant pouvant atteindre 25 m de haut au feuillage persistant avec une couronne largement déployée et de nombreuses racines adventives. Celles-ci poussent des branches vers la terre et peuvent former une véritable petite forêt.",
  price: 89.99,
  stock: 10,
  imageUrl: "712256968.jpg",
  status: "active"
});

const pine = await Tree.create({
  reference: generateReference(),
  name: "Sapin",
  description:
    "Le sapin est un conifère à aiguilles persistantes, souvent utilisé comme arbre de Noël et apprécié pour son bois et sa résine.",
  price: 29.99,
  stock: 30,
  imageUrl: "894651320.jpg",
  status: "active"
});

const cherry = await Tree.create({
  reference: generateReference(),
  name: "Cerisier",
  description:
    "Le cerisier est un arbre fruitier à fleurs blanches ou roses, apprécié pour ses fruits sucrés et son aspect ornemental au printemps.",
  price: 49.99,
  stock: 30,
  imageUrl: "699956231.jpg",
  status: "active"
});

const mango = await Tree.create({
  reference: generateReference(),
  name: "Manguier",
  description:
    "Le manguier est un arbre tropical à feuillage dense, connu pour ses fruits juteux et sucrés, les mangues.",
  price: 39.99,
  stock: 30,
  imageUrl: "100256955.jpg",
  status: "active"
});

const litchee = await Tree.create({
  reference: generateReference(),
  name: "Litchi",
  description:
    "Le litchi est un arbre fruitier tropical, connu pour ses fruits sucrés et juteux, recouverts d'une peau rugueuse et rose.",
  price: 59.99,
  stock: 30,
  imageUrl: "225647895.jpg",
  status: "active"
});

const dragonfruit = await Tree.create({
  reference: generateReference(),
  name: "Pitaya",
  description:
    "Le pitaya, ou fruit du dragon, est le fruit de plusieurs espèces de cactus. Il est connu pour son apparence unique et ses saveurs sucrées.",
  price: 49.99,
  stock: 30,
  imageUrl: "665899923.jpg",
  status: "active"
});

const pokok = await Tree.create({
  reference: generateReference(),
  name: "Mangoustanier",
  description:
    "Le mangoustanier est un arbre tropical à feuilles persistantes, connu pour ses fruits ronds et violets, le mangoustan.",
  price: 79.99,
  stock: 30,
  imageUrl: "777745621.jpg",
  status: "active"
});

console.log("🚧 Création orders...");

const order1 = await createOrder(
  johnUser,
  [
    { tree: oak, quantity: 1 },
    { tree: maple, quantity: 2 },
  ],
  {
    firstName: "John",
    lastName: "Doe",
    localisation: "Paris",
    note: "Livrer en semaine",
  }
);

const order2 = await createOrder(
  adminUser,
  [
    { tree: oak, quantity: 2 },
    { tree: pine, quantity: 1 },
  ],
  {
    firstName: "Alice",
    lastName: "Green",
    localisation: "Lyon",
    note: "Le plus rapidement possible",
  }
);

console.log("✅ Migration OK ! Fermeture de la base...");
await sequelize.close();
