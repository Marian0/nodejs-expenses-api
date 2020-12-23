import { CustomHelpers, ValidationError } from "joi";
import Container from "typedi";
import UserService from "../../services/users";

export const uniqueEmail = async (value: string, helpers: CustomHelpers) => {
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