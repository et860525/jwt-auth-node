import express from 'express';
import { validate } from '../middleware/validate';
import { createUserSchema, loginUserSchema } from '../models/user.schema';
import AuthController from '../controllers/auth.controller';

const router = express.Router();
const authController = new AuthController();

// Register user route
router.post(
  '/register',
  validate(createUserSchema),
  authController.registerHandler
);

// Login user route
router.post('/login', validate(loginUserSchema), authController.loginHandler);

export default router;
