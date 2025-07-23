import express from 'express';
import { getAll, getByReference, create, update, deleteById, deactivate, reactivate, getBestsellers } from '../controllers/product.controller.js';
import { authenticate, checkRole } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import multer from 'multer';

const router = express.Router();

router.get('/bestsellers', getBestsellers)
router.get('/', getAll);
router.get('/:reference', getByReference);

router.post('/', authenticate, checkRole('admin'), upload.single('image'), create);

router.patch('/:reference', authenticate, checkRole('admin'), upload.single('image'), update);
router.patch('/:reference/deactivate', authenticate, checkRole('admin'), deactivate);
router.patch('/:reference/reactivate', authenticate, checkRole('admin'), reactivate);

router.delete('/:reference', authenticate, checkRole('admin'), deleteById);

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'Fichier trop volumineux (max 5MB)'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                message: 'Trop de fichiers'
            });
        }
    }
    
    if (error.message && error.message.includes('Type de fichier non autorisé')) {
        return res.status(400).json({
            message: error.message
        });
    }
    
    next(error);
});

export default router;