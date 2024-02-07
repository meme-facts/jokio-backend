export interface ICreateMessageInputDTO {
  id?: string;
  message: string;
  fromUserId: string;
  toUserId: string;
  isRead?: boolean;
  created_at?: Date;
}
