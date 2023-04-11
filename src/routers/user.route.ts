import express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { restrictTo } from '../middleware/restrictTo';
import UserController from '../controllers/user.controller';

const router = express.Router();
const userController = new UserController();

router.use(deserializeUser, requireUser);

// Admin get all Users
router.get('/', restrictTo('admin'), userController.getAllUsersHandler);

// Get my info
router.get('/me', userController.getMeHandler);

export default router;
