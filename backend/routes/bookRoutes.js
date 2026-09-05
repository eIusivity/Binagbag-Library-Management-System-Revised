import express from 'express';
import { getBooks, getBook, getBookCopies, editBook } from '../controllers/bookController.js';

const router = express.Router();
router.get('/', getBooks);
router.get('/:id',getBook);
router.get('/:id/copies',getBookCopies);
router.put('/:id/edit',editBook);
router.post('/create',createBook);
export default router;