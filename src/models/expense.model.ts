import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity({ name: "expenses" })
export class Expense {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  public detail: string;

  @Column()
  public amount: number
  
  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, user => user.expenses)
  @Index()
  user: User;

}
