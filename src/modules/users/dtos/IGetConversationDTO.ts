export interface IGetConversationDTO {
  loggedUserId: string;
  targetUserId: string;
  offset: number;
  limit: number;
}
