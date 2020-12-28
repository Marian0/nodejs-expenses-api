import * as argon2 from 'argon2';
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

  public async SignUp({ email, password, ...rest }: User): Promise<{ user: User; auth: TokenPayload }> {
    try {
      
      //Generate salt
      const salt = randomBytes(32);

      /**
       * Hash password first
       */
      const hashedPassword = await argon2.hash(password, { salt });
      const user = await this.userRepository.save({
        email,
        ...rest,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });

      const auth = this.generateToken(user);

      if (!user) {
        throw new Error('User cannot be created');
      }

      //   await this.mailer.SendWelcomeEmail(user);

      return { user, auth };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: User; auth: TokenPayload }> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new Exception('User not found!', 404);
    }

    //Verify from argon2 to prevent 'timing based' attacks
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      throw new Error('Invalid Password');
    }

    return {
      user,
      auth: this.generateToken(user)
    };
  }

  private generateToken(user: User): TokenPayload {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    const expiration = Math.floor(exp.getTime() / 1000)

    const token = jwt.sign(
      {
        id: user.uuid, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: expiration,
      },
      config.jwtSecret,
    )

    const refreshToken = jwt.sign(
      {
        id: user.uuid, // We are gonna use this in the middleware 'isAuth'
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
