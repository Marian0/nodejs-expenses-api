import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { expenseResource } from '../api/resources/expense.resources';
import { Expense } from '../models/expense.model';
import { User } from '../models/user.model';

@Service()
export default class ExpenseService {

  constructor(@InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>) { }

  /**
   * @param expenseData 
   * @param owner 
   */
  public async createExpense(expenseData: Expense, owner: User): Promise<{ expense: Expense }> {
    try {

      const expense = await this.expenseRepository.save({
        ...expenseData,
        user: owner
      });

      return { expense: expenseResource(expense) };

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Gets expenses from a given user
   * @param owner <Optional>
   */
  public async getExpenses(owner?: User): Promise<{ expenses: Expense[] }> {
    try {

      let conditions = {}

      if (owner) {
        conditions['where'] = {
          user: owner
        }
      } else {
        //no owner, include user Relation
        //@todo: Implemet DTO to avoid sending password/salts
        conditions["relations"] = ["user"]
      }

      const expenses = await this.expenseRepository.find(conditions);

      return { expenses: expenses.map(expense => expenseResource(expense)) };

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
