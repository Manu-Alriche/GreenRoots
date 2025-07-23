import Stripe from 'stripe';
import { Order, OrderItem, Tree, User } from '../models/index.js';

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY manquante dans les variables d\'environnement');
    process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
    try {
        const { items, firstName, lastName, localisation, note } = req.body;
        const userId = req.userId;

        if (!userId || !items || !items.length || !firstName || !lastName || !localisation) {
            return res.status(400).json({ 
                message: 'Données manquantes pour créer la session de paiement',
                debug: { userId, items: items?.length, firstName, lastName, localisation }
            });
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const lineItems = [];
        let totalAmount = 0;
        for (const item of items) {
            const tree = await Tree.findByPk(item.treeId);
            if (!tree) {
                return res.status(404).json({ 
                    message: `Produit non trouvé: ${item.treeId}` 
                });
            }
            if (tree.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Stock insuffisant pour ${tree.name}. Stock disponible: ${tree.stock}` 
                });
            }
            const unitAmount = Math.round(tree.price * 100);
            totalAmount += unitAmount * item.quantity;
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: tree.name,
                        description: tree.description,
                        images: tree.imageUrl ? [`${process.env.FRONTEND_URL}/images/arbres/${tree.imageUrl}`] : undefined,
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            });
        }

        if (!process.env.FRONTEND_URL) {
            console.error('FRONTEND_URL manquante dans .env');
            return res.status(500).json({ message: 'Configuration serveur manquante' });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/panier/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/panier`,
            customer_email: user.email,
            metadata: {
                userId: userId.toString(),
                firstName,
                lastName,
                localisation,
                note: note || '',
                items: JSON.stringify(items)
            }
        });
        res.json({ 
            sessionId: session.id,
            url: session.url 
        });
    } catch (error) {
        console.error('Erreur lors de la création de la session Stripe:', error);
        res.status(500).json({ 
            message: 'Erreur serveur lors de la création de la session de paiement',
            error: error.message 
        });
    }
}


export async function getSessionDetails(req, res) {
    try {
        const { sessionId } = req.params;      
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json({
            session: {
                id: session.id,
                payment_status: session.payment_status,
                customer_email: session.customer_email,
                amount_total: session.amount_total,
                metadata: session.metadata
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des détails de la session',
            error: error.message 
        });
    }
}

export async function createOrderFromSession(req, res) {
    try {
        const { sessionId } = req.body;
        const userId = req.userId;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID manquant' });
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID manquant depuis le middleware' });
        }
        const session = await stripe.checkout.sessions.retrieve(sessionId);   
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Le paiement n\'est pas confirmé' });
        }
        const existingOrder = await Order.findOne({
            where: { stripeSessionId: sessionId }
        });

        if (existingOrder) {
            return res.json({ 
                message: 'Commande déjà créée',
                orderId: existingOrder.id 
            });
        }
        const { firstName, lastName, localisation, note, items } = session.metadata;
        
        if (!items) {
            throw new Error('Items manquants dans la metadata de la session');
        }
        
        const parsedItems = JSON.parse(items);
        const order = await Order.create({
            user_id: parseInt(userId),
            firstName,
            lastName,
            localisation,
            note: note || '',
            total: session.amount_total / 100,
            status: 'paid',
            stripeSessionId: sessionId
        });
        for (const item of parsedItems) {
            const tree = await Tree.findByPk(item.treeId);
            if (tree) {
                await OrderItem.create({
                    order_id: order.id,
                    tree_id: item.treeId,
                    quantity: item.quantity,
                    price: tree.price
                });
                const newStock = Math.max(0, tree.stock - item.quantity);
                await tree.update({ stock: newStock });
            } else {
                console.warn('⚠️ Arbre non trouvé:', item.treeId);
            }
        }        
        res.json({ 
            message: 'Commande créée avec succès',
            orderId: order.id 
        });

    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création de la commande',
            error: error.message 
        });
    }
}