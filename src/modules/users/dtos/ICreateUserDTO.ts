interface ICreateUserDTO {
  full_name: string;
  nickname: string;
  email: string;
  password: string;
  isPrivate: boolean;
  img_url: string;
}
export { ICreateUserDTO };
