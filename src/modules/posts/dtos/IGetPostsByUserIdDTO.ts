interface IGetPostsByIdDTO {
  page: number;
  limit: number;
  userName?: string;
  logged_user_id?: string;
}

export { IGetPostsByIdDTO };
