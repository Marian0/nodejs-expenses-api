import { Router } from 'express';
import auth from './auth.route';
import users from './user.route';
import expense from './expense.route';

const router = Router();
auth(router);
users(router);
expense(router);

export default router;
