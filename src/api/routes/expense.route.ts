import { celebrate } from 'celebrate';
import { Request, Response, Router } from 'express';
import Joi from 'joi';
import Container from 'typedi';
import { Expense } from '../../models/expense.model';
import { User } from '../../models/user.model';
import ExpenseService from '../../services/expense.service';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/expenses', route);

  /**
   * POST api/expenses
   * Creates an expense related to current logged user
   */
  route.post(
    '/',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        detail: Joi.string()
          .min(2)
          .max(30)
          .required(),
        date: Joi.date()
          .required(),
        amount: Joi.number()
          .required(),
      }),
    }, {
      abortEarly: false
    }),
    middlewares.attachCurrentUser,
    async (req: Request, res: Response) => {
      const expenseService = Container.get(ExpenseService);
      const response = await expenseService.createExpense(req.body as Expense, req.currentUser as User);
      return res.json(response).status(201);
    },
  );

  /**
   * GET api/expenses
   * Get expenses from current user
   */
  route.get(
    '/',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response) => {
      const expenseService = Container.get(ExpenseService);
      const response = await expenseService.getExpenses(req.currentUser as User);
      return res.json(response).status(201);
    },
  );
};
