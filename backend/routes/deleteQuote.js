import express from 'express';
import { deleteQuote } from '../controllers/quoteController.js';
import {authMiddleware} from '../middlewares/authMiddlewere.js'

const router = express.Router();

// This handles DELETE requests to /api/delete-quote
router.delete('/', authMiddleware,deleteQuote);

export default router;
