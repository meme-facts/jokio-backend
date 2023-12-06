export enum SortByEnum {
  createdAt = "created_at",
  points = "points",
}

export interface IGetAllFollowsDTO {
  page: number;
  limit?: number;
  userId: string;
  sortBy?: string;
}
