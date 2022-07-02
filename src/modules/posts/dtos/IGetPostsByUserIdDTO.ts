interface IGetPostsByIdDTO {
  page: number;
  limit: number;
  user_id?: string;
  logged_user?: string;
}

export { IGetPostsByIdDTO };
