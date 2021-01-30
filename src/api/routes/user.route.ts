import { Request, Response, Router } from 'express';
import middlewares from '../middlewares';
import { userResource } from '../resources/user.resources';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  /**
   * GET users/me
   */
  route.get(
    '/me',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response) => {
      return res.json({ user: userResource(req.currentUser) }).status(200);
    },
  );
};
