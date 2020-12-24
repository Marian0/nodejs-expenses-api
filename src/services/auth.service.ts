import * as argon2 from 'argon2';
import { CelebrateError } from 'celebrate';
import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import config from '../config';
import { Exception } from '../Exception';
import { User } from '../models/user.model';

type TokenPayload = {
  token: string
  refreshToken: string
  expiration: number
 }

@Service()
export default class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async SignUp({email, password, ...rest}: User): Promise<{ user: User; auth: TokenPayload }> {
    try {
      
      //Generate salt
      const salt = randomBytes(32);

      /**
       * Hash password first
       */
      const hashedPassword = await argon2.hash(password, { salt });
      const userRecord = await this.userRepository.save({
        email,
        ...rest,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });

      const auth = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      //   await this.mailer.SendWelcomeEmail(userRecord);

      /**
       * @TODO This is not the best way to deal with this
       * There should exist a 'Mapper' layer
       * that transforms data from layer to layer
       */
      const user = userRecord;
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user, auth };
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        // Duplicate username
        throw new Error('User already exist!');
      }
      console.log(error);
      throw error;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: User; auth: TokenPayload }> {
    const record = await this.userRepository.findOne({ email });

    if (!record) {
      throw new Exception('User not found!', 404);
    }
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    const validPassword = await argon2.verify(record.password, password);
    if (validPassword) {
      const token = this.generateToken(record);
      const user = record;
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      /**
       * Return user and token
       */
      return { user, auth: token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  private generateToken(user: User): TokenPayload {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    const expiration = Math.floor(exp.getTime() / 1000)

    const token = jwt.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: expiration,
      },
      config.jwtSecret,
    )

    const refreshToken = jwt.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: expiration * 2,
      },
      config.jwtSecret,
    )

    return { 
      token,
      refreshToken,
      expiration
    }
  }

}
