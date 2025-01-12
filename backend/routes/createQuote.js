import express from 'express';
import {createQuote} from '../controllers/quoteController.js'
import { authMiddleware } from '../middlewares/authMiddlewere.js';
const router = express.Router();

// Register user route with middleware
router.post('/', createQuote);

export default router;