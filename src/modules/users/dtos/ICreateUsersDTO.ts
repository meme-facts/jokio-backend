interface IUserDTO {
  id?: string;
  full_name?: string;
  nickname: string;
  email: string;
  password: string;
  isPrivate?: boolean;
}
export { IUserDTO };
