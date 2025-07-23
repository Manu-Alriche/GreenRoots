import { StatusCodes } from "http-status-codes";
import { Tree } from "../models/tree.model.js";
import { User, Role, OrderItem, sequelize } from "../models/index.js";
import jwt from "jsonwebtoken";

export async function getAll(req, res) {
    try {        
        let isAdmin = false;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findByPk(decoded.user_id, {
                    include: { model: Role, as: "role" }
                });
                
                if (user && user.role && user.role.name === 'admin') {
                    isAdmin = true;
                }
            } catch (err) {
                console.log("Token invalide ou utilisateur non admin");
            }
        }
        let trees;
        if (isAdmin) {
            trees = await Tree.findAll();
        } else {
            trees = await Tree.findAll({
                where: { status: 'active' }
            });
        }       
        return res.status(StatusCodes.OK).json(trees);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des arbres:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erreur lors de la récupération des arbres",
            error: error.message
        });
    }
}

export async function getByReference(req, res) {
    try {
        const tree = await Tree.findOne({ 
            where: { reference: req.params.reference }
        });
        if (!tree) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Arbre introuvable" });
        }
        return res.status(StatusCodes.OK).json(tree);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erreur lors de la récupération de l'arbre",
            error: error.message
        });
    }
}

export async function create(req, res) {
    try {
        const { name, description, price, stock } = req.body;   
        if (!name || !description || !price || !stock) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                message: "Tous les champs sont obligatoires" 
            });
        }
        const imageUrl = req.file ? req.file.filename : null;        
        if (!imageUrl) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                message: "L'image est obligatoire" 
            });
        }
        const newTree = await Tree.create({ 
            name, 
            description, 
            price: parseFloat(price), 
            stock: parseInt(stock), 
            imageUrl,
            status: 'inactive'
        });
        return res.status(StatusCodes.CREATED).json(newTree);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            message: "Erreur lors de la création de l'arbre", 
            error: error.message 
        });
    }
}

export async function update(req, res) {
    try {
        const { name, description, price, stock, status } = req.body;   
        const tree = await Tree.findOne({ where: { reference: req.params.reference } });
        if (!tree) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Arbre introuvable" });
        }       
        const updateData = {
            name: name || tree.name,
            description: description || tree.description,
            price: price ? parseFloat(price) : tree.price,
            stock: stock ? parseInt(stock) : tree.stock,
            status: status || tree.status
        };     
        if (req.file) {
            updateData.imageUrl = req.file.filename;
        }
        
        if (status === 'inactive' && tree.status === 'active') {
            updateData.deactivatedAt = new Date();
        }      
        await tree.update(updateData);
        return res.status(StatusCodes.OK).json(tree);       
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            message: "Erreur lors de la mise à jour de l'arbre", 
            error: error.message 
        });
    }
}

export async function deactivate(req, res) {
    try {
        const tree = await Tree.findOne({ where: { reference: req.params.reference } });
        if (!tree) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Arbre introuvable" });
        }     
        await tree.update({ 
            status: 'inactive',
            deactivatedAt: new Date()
        });             
        return res.status(StatusCodes.OK).json({ 
            message: "Arbre désactivé avec succès",
            tree: tree
        });
    } catch (error) {
        console.error("❌ Erreur désactivation:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: "Erreur lors de la désactivation de l'arbre", 
            error: error.message 
        });
    }
}

export async function reactivate(req, res) {
    try {
        const tree = await Tree.findOne({ where: { reference: req.params.reference } });
        if (!tree) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Arbre introuvable" });
        }        
        await tree.update({ 
            status: 'active',
            deactivatedAt: null
        });              
        return res.status(StatusCodes.OK).json({ 
            message: "Arbre réactivé avec succès",
            tree: tree
        });
    } catch (error) {
        console.error("❌ Erreur réactivation:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: "Erreur lors de la réactivation de l'arbre", 
            error: error.message 
        });
    }
}

export async function deleteById(req, res) {
    try {
        const tree = await Tree.findOne({ where: { reference: req.params.reference } });
        if (!tree) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Arbre introuvable" });
        }
        const { OrderItem } = await import('../models/index.js');
        const orderItemsCount = await OrderItem.count({
            where: { tree_id: tree.id }
        });
        if (orderItemsCount > 0) {
            return res.status(StatusCodes.CONFLICT).json({ 
                message: "Impossible de supprimer cet arbre car il est lié à des commandes existantes. Utilisez la désactivation à la place.",
                linkedOrders: orderItemsCount
            });
        }
        await tree.destroy();
        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.error("❌ Erreur suppression:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: "Erreur lors de la suppression de l'arbre", 
            error: error.message 
        });
    }
}

export const getBestsellers = async (req, res) => {
    try {
        const orderStats = await OrderItem.findAll({
            attributes: [
                'tree_id',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'totalOrdered']
            ],
            group: ['tree_id'],
            order: [[sequelize.literal('"totalOrdered"'), 'DESC']],
            limit: 10,
            raw: true
        });
        const treeIds = orderStats.map(stat => stat.tree_id);      
        let trees;
        if (treeIds.length > 0) {
            trees = await Tree.findAll({
                where: {
                    status: 'active',
                    id: treeIds
                }
            });
        } else {
            trees = await Tree.findAll({
                where: { status: 'active' },
                order: [['name', 'ASC']],
                limit: 3
            });
        }
        const bestsellers = trees.map(tree => {
            const stats = orderStats.find(stat => stat.tree_id === tree.id);
            return {
                ...tree.toJSON(),
                totalOrdered: stats ? parseInt(stats.totalOrdered) : 0
            };
        });
        bestsellers.sort((a, b) => b.totalOrdered - a.totalOrdered);
        res.json(bestsellers.slice(0, 3));
    } catch (error) {
        console.error('❌ Erreur bestsellers:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des bestsellers',
            error: error.message 
        });
    }
};