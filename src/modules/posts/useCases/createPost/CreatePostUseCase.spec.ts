import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreatePostUseCase } from "./CreatePostUseCase";

let postRepositoryInMemory: IPostRepository;
let userRepositoryInMemory: IUserRepository;
let createPostUseCase: CreatePostUseCase;
let createUserUseCase: CreateUserUseCase;
let user
describe('CreatePostUseCase', () => {
beforeEach(async () => {
    postRepositoryInMemory = new PostRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createPostUseCase = new CreatePostUseCase(postRepositoryInMemory,userRepositoryInMemory);
    user = await createUserUseCase.execute({
        full_name: "opateste",
        nickname: "teste2",
        email: "silva@teste.com",
        password: "1234",
    })
})

    it('should create a post', async () => {
        const post = await createPostUseCase.execute({
            postDescription: 'olha ai um teste chegando',
            user_id: user.user.id,
            img_url:'https://i.ytimg.com/vi/C_73egXn3bs/maxresdefault.jpg'
        })
        expect(post).toHaveProperty('id')
    })

    it('should not create a post with an unexistend user', async () => {
        await expect(async () => {
            await createPostUseCase.execute({
                postDescription: 'olha ai um teste chegando',
                user_id: 'dwaiohdawhoi',
                img_url:'https://i.ytimg.com/vi/C_73egXn3bs/maxresdefault.jpg'
            })
        }).rejects.toBeInstanceOf(AppError);
        await expect(async () => {
            await createPostUseCase.execute({
                postDescription: 'olha ai um teste chegando',
                user_id: 'dwaiohdawhoi',
                img_url:'https://i.ytimg.com/vi/C_73egXn3bs/maxresdefault.jpg'
            })
        }).rejects.toThrowError('This users do not exists.');

    })
})