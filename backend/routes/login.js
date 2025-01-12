import express from 'express';
import { loginUser } from '../controllers/userController.js';
const router = express.Router();

// Register user route with middleware
router.post('/', loginUser);

export default router;
