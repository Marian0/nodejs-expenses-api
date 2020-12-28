import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { User } from '../../models/user.model';
import AuthService from '../../services/auth.service';
import middlewares from '../middlewares';
import { userResource } from '../resources/user.resources';
import { uniqueEmail } from '../validators/uniqueEmail.validator';

const route = Router();

// @TODO Make Routes like this
// export class AuthRoutes {
//   constructor(@Inject(AuthService) private authService: AuthService) {}
// }

export default app => {
    app.use('/auth', route);

    /**
     * POST auth/signup
     */
    route.post(
        '/signup',
        celebrate({
            body: Joi.object({
                name: Joi.string()
                    .min(2)
                    .max(30)
                    .required(),
                email: Joi.string()
                    .trim()
                    .email()
                    .required()
                    .external(uniqueEmail),
                password: Joi.string()
                    .min(8)
                    .max(30)
                    .required(),
            }),
        }, {
            abortEarly: false
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const authServiceInstance = Container.get(AuthService);
                const { user, auth } = await authServiceInstance.SignUp(req.body as User);
                return res.json({
                    user: userResource(user),
                    auth
                }).status(201);
            } catch (e) {
                console.log(' error ', e);
                return next(e);
            }
        },
    );

    /**
     * POST auth/signin
     */
    route.post(
        '/signin',
        celebrate({
            body: Joi.object({
                email: Joi.string()
                    .trim()
                    .email()
                    .required(),
                password: Joi.string()
                    .min(8)
                    .max(30)
                    .required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, password } = req.body;
                const authServiceInstance = Container.get(AuthService);
                const { user, auth } = await authServiceInstance.SignIn(email, password);
                return res.json({
                    user: userResource(user),
                    auth
                }).status(200);
            } catch (e) {
                console.log(' error ', e);
                return next(e);
            }
        },
    );

    /**
     * POST auth/logout
     */
    route.post(
        '/logout',
        middlewares.isAuth,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // @TODO AuthService.Logout(req.user) for doing some other stuffff
                return res.json({
                    message: "Logged out successfully"
                }).status(200).end();
            } catch (e) {
                console.log(' error ', e);
                return next(e);
            }
        },
    );
};
