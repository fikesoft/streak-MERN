import express from 'express';
import { editQuote } from '../controllers/quoteController.js';
import {authMiddleware} from '../middlewares/authMiddlewere.js'

const router = express.Router();

// This handles DELETE requests to /api/delete-quote
router.put('/',authMiddleware ,editQuote);

export default router;