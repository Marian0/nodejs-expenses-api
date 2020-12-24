import { ValidationError } from "joi";
import Container from "typedi";
import UserService from "../../services/user.service";

/**
 * Validator for checking in database if the email is already taken
 * @param value 
 */
export const uniqueEmail = async (value: any) => {
  //Get user service via DI
  const userServiceInstance = Container.get(UserService);

  //check if current email already exists in database
  const tmpUser = await userServiceInstance.findOneByEmail(value)

  if (tmpUser) {
    throw new ValidationError("any.uniqueEmail", [
      {
        "message": `The email '${value}' is already taken`,
        "type": "email.unique",
        "path": [
          "email"
        ]
      }
    ], {});
  }

  return value;
}