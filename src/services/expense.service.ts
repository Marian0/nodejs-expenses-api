import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
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

      return { expense };

    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
