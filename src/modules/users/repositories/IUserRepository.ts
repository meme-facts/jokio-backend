import { IUserDTO } from "../../dtos/IUsersDTO"
import { User } from "../infra/typeorm/entities/Users"

interface IUserRepository {
create({fullname, nickname, email,password}:IUserDTO): Promise<User>;
getByEmail(email:string): Promise<User>;
getByNickName(nickname:string):Promise<User>;
}

export { IUserRepository }
