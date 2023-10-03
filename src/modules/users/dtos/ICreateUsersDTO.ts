interface IUserDTO {
  id?: string;
  full_name?: string;
  image_url?: string;
  nickname: string;
  email: string;
  password: string;
  isPrivate?: boolean;
}
export { IUserDTO };
