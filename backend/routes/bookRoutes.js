import express from 'express';
import { getBooks, getBook, editBook, createBook } from '../controllers/bookController.js';

const router = express.Router();
router.get('/', getBooks);
router.get('/:id',getBook);
router.put('/:id/edit',editBook);
router.post('/create',createBook)
export default router;