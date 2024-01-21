export interface IGetConversationDTO {
  loggedUserId: string;
  targetUserId: string;
  page: number;
  limit: number;
}
