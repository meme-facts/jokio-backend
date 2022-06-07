interface IPostReactionRepository {
  create({ postId, userId, reactionType }: IReactionsDTO): Promise<void>;
}

export { IPostReactionRepository };
