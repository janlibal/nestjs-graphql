import { User } from "../model/user.model";

export class GetUserQuery {
  //constructor(public readonly id: string) {}
  constructor(public readonly id: User['id']) {}
}
