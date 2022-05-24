import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePostUseCase } from "./CreatePostUseCase";


class CreatePostController {

    async handle(request: Request, response: Response): Promise<Response>{
        const createPostUseCase = container.resolve(CreatePostUseCase);

        const { id:user_id } = request.user
        const {
            postDescription,
            img_url
        } = request.body
        const post = await createPostUseCase.execute({
             postDescription,
             user_id,
             img_url
        })
        return response.status(201).json(post)
    }
}

export { CreatePostController }