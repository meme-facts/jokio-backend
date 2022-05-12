import { IUserDTO } from "../../../dtos/IUsersDTO";
import { User } from "../../infra/typeorm/entities/Users";
import { IUserRepository } from "../IUserRepository";


class UserRepositoryInMemory implements IUserRepository {
    users:User[] = [];
    async create({ fullname, nickname, email, password }: IUserDTO): Promise<User> {
        const user = new User;
        Object.assign(user,{
            fullname, 
            nickname, 
            email, 
            password
        })
         this.users.push(user);
         return user;
    }
   
    async getByEmail(email: string): Promise<User>  {
      console.log(this.users)
        return this.users.find((user) => user.email === email);

       
      }
      async getByNickName(nickName: string):Promise<User>{
        console.log(this.users)
        return this.users.find((user) => user.nickname === nickName)

    
      }

}

export { UserRepositoryInMemory }