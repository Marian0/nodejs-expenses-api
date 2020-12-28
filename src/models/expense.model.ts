import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity({ name: "expenses" })
export class Expense {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

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
  @JoinColumn({ name: "userRef" })
  @Index()
  user: User;

}
