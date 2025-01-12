import express from 'express';
import {getTodaysQuote} from '../controllers/quoteController.js'
const router = express.Router();

// Register user route with middleware
router.get('/',getTodaysQuote);

export default router;