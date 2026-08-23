import express from 'express';
import { getServiceCategories, getServices, getServiceById } from '../controllers/serviceController';

const router = express.Router();

router.get('/categories', getServiceCategories);
router.get('/', getServices);
router.get('/:id', getServiceById);

export default router;
