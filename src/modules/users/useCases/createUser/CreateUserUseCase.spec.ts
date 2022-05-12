import { AppError } from "../../../../shared/errors/AppError";
import { UserRepositoryInMemory } from "../../repositories/InMemory/UserRepositoryInMemory"
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
describe('CreateUserUseCase', () => {

beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
})

it('should create an user', async () => {
    const user = await createUserUseCase.execute({
        fullname: 'opateste',
        nickname:'tes',
        email:'test@teste.com',
        password:'1234'
    })
    expect(user).toHaveProperty('user');
    expect(user).toHaveProperty('token');
})

it('should not be able to create an user with a existent email', async () => {
    expect(async () => {
        await createUserUseCase.execute({
            fullname: 'opateste',
            nickname:'teste',
            email:'teste123@teste.com',
            password:'1234'
        })
        await createUserUseCase.execute({
            fullname: 'opateste',
            nickname:'teste2',
            email:'teste123@teste.com',
            password:'1234'
        })
    }).rejects.toBeInstanceOf(AppError);
  
})
it('should not be able to create an user with a existent nickname', async () => {
    userRepositoryInMemory.users = []
    expect(async () => {
        await createUserUseCase.execute({
            fullname: 'opateste',
            nickname:'te',
            email:'teste@teste.com',
            password:'1234'
        })
        await createUserUseCase.execute({
            fullname: 'opateste',
            nickname:'te',
            email:'teste2@teste.com',
            password:'1234'
        })
  
    }).rejects.toBeInstanceOf(AppError);
})
})
