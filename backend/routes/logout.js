import express from 'express';
import {logOutUser}  from '../controllers/userController.js';

const router = express.Router();

// Logout route
router.post('/', logOutUser);

export default router;
