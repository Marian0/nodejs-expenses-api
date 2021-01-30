import { Request, Response, Router } from 'express';
import packageJson from '../../../package.json';

const route = Router();

export default (app: Router) => {
  app.use('', route);
  /**
   * GET /
   * Public endpoint with server status
   */
  route.get(
    '/',
    async (_: Request, res: Response) => {
      return res.json({
        'description': 'Expenses API',
        'version': packageJson.version
      }).status(200);
    },
  );
};
