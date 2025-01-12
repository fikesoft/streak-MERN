import express from 'express';
import { registerUsers } from '../controllers/userController.js';
import { hashPassword } from '../middlewares/hashPassword.js';
const router = express.Router();

// Register user route with middleware
router.post('/', hashPassword, registerUsers);

export default router;
