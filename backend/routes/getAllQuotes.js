import express from "express";
import {authMiddleware} from '../middlewares/authMiddlewere.js'
import {getAllQuotes} from '../controllers/quoteController.js'
const router = express.Router();

router.get('/',authMiddleware,getAllQuotes);

export default router;