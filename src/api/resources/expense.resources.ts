import { Expense } from "../../models/expense.model";
import omit from "lodash/omit"

export const expenseResource = (expense: Expense) : any => {
  //Hide from request
  return omit(expense, ['user'])
}