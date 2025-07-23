import { PasswordResetToken } from '../models/index.js';
import { Op } from 'sequelize';

export async function cleanupExpiredTokens() {
    try {
        const deletedCount = await PasswordResetToken.destroy({
            where: {
                [Op.or]: [
                    {
                        expires_at: {
                            [Op.lt]: new Date()
                        }
                    },
                    {
                        used: true
                    }
                ]
            }
        });
        
        console.log(`🧹 Tokens nettoyés: ${deletedCount} tokens supprimés`);
        return deletedCount;
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage des tokens:', error);
        throw error;
    }
}

export function startTokenCleanup() {
    setInterval(async () => {
        try {
            await cleanupExpiredTokens();
        } catch (error) {
            console.error('Erreur lors du nettoyage automatique:', error);
        }
    }, 60 * 60 * 1000); // 1 heure
    
    console.log('🕐 Nettoyage automatique des tokens activé (toutes les heures)');
}