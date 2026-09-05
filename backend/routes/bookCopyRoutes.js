import express from 'express';
import { createBookCopies, getBookCopies } from '../controllers/bookCopyController.js';

const router = express.Router();
router.get('/:id', getBookCopies)
router.post('/:id/create', createBookCopies)
export default router;