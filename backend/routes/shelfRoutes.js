import express from 'express';
import { getShelves } from '../controllers/shelfController.js';

const router = express.Router();
router.get('/', getShelves);

export default router;