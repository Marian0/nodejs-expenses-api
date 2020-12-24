import { Router } from 'express';
import auth from './auth.route';
import users from './user.route';

const router = Router();
auth(router);
users(router);

export default router;
