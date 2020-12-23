import { Service } from 'typedi';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../models/User';

@Service()
export default class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findOne(id?: string, options?: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(id, options);
  }
}
