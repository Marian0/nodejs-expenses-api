import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { lowercase } from '../utils/transformers.db';
import { Expense } from './expense.model';

export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  public name: string;

  @Index({ unique: true })
  @Column({
    nullable: false,
    transformer: [lowercase],
  })
  public email: string;

  @Column({
    // select: false,
    nullable: false,
  })
  public password: string;

  @Column({
    select: false,
    nullable: false,
  })
  public salt: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  public role: Role;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => Expense, expense => expense.user)
  expenses: Expense[];

  // @AfterLoad()
  // public deletePropertis(): void {
  //   // delete this.password;
  //   // delete this.salt;
  //   delete this.email;
  //   if (this.password) {
  //     console.log(this.password);
  //   }
  // }
}
