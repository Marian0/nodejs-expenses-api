import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import errorHandlers from '../api/middlewares/errorHandler';
import routes from '../api/routes';

export default (app: express.Application) => {
  app.enable('trust proxy');
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(errors());
  app.use('/api', routes);

  //Add error handlers middleware
  errorHandlers(app);
};
