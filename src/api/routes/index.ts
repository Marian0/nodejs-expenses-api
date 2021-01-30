import { Router } from 'express';
import auth from './auth.route';
import users from './user.route';
import expense from './expense.route';
import main from './main.route';

const router = Router();
auth(router);
users(router);
expense(router);
main(router);

export default router;
