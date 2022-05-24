import { IPostDTO } from "@modules/posts/dtos/IPostDTO";
import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreatePostUseCase {
    constructor(
        @inject('PostRepository')
        private postRepository: IPostRepository,
        @inject('UserRepository')
        private userRepository: IUserRepository
    ){}
    async execute({postDescription, user_id, img_url}:IPostDTO):Promise<Post>{
        const user = await this.userRepository.getById(user_id);
        if(!user) {
            throw new AppError('This users do not exists.');
        }
        const post = await this.postRepository.create({
            postDescription,
            user_id,
            img_url
        });
        return post
    }

}

export { CreatePostUseCase }