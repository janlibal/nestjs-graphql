import { User } from "../model/user.model";

export class GetUserQuery {
<<<<<<< HEAD
    constructor(public readonly id: string) {}
  }
  
=======
  //constructor(public readonly id: string) {}
  constructor(public readonly id: User['id']) {}
}
>>>>>>> 4cc21f8 (Update cqrs)
