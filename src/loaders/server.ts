import bodyParser from 'body-parser';
import { errors, isCelebrateError } from 'celebrate';
import cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import Joi from 'joi';
import { ValidationError } from 'joi';
import routes from '../api/routes';

export default (app: express.Application) => {
  app.enable('trust proxy');
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(errors());

  app.use('/api', routes);
};
