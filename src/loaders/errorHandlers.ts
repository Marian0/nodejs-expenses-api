import { isCelebrateError } from 'celebrate';
import * as express from 'express';
import Joi from 'joi';
import { ValidationError } from 'joi';

export default (app: express.Application) => {
  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const error: Error = new Error('Not Found');
    error['status'] = 404;
    next(error);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }

    /**
     * Handle validation error thrown by Celebrate + Joi
     */
    if (isCelebrateError(err)) {
      const outputErrors = []

      //for each  segment
      err.details.forEach((value: ValidationError, key: string) => {
        //foreach field
        value.details.forEach((fieldError: Joi.ValidationErrorItem) => {
          outputErrors.push({
            message: fieldError.message,
            type: fieldError.type,
            segment: key,
            path: fieldError.path.join('.'),
          })
        })
      })

      return res
        .status(422)
        .send({
          errors: outputErrors
        })
        .end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
}
