interface IGetAllUsersDTO {
  page: number;
  limit?: number;
  user_reference?: string;
  logged_user_id: string;
}

export interface IGetAllFollowingDTO {
  page: number;
  limit?: number;
  user_reference?: string;
  following_id: string;
}

export { IGetAllUsersDTO };
