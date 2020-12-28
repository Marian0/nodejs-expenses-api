import { User } from "../../models/user.model"
import omit from "lodash/omit"  

export const userResource = (user: User) : any => {
  //Hide from request
  return omit(user, ['salt', 'password'])
}