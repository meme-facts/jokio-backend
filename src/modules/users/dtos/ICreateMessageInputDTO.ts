export interface ICreateMessageInputDTO {
  message: string;
  fromUserId: string;
  toUserId: string;
  isRead?: boolean;
}
