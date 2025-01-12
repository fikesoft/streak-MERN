import express from 'express';
import {getTodaysQuote} from '../controllers/quoteController.js'
import {authMiddleware} from '../middlewares/authMiddlewere.js'
const router = express.Router();

// Register user route with middleware
router.get('/',authMiddleware,getTodaysQuote);

export default router;