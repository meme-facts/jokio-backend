import { StatusEnum } from "@shared/enums/StatusEnum";

interface ICreateFollowerDTO {
  requestedUserId: string;
  requesterUserId: string;
  fStatus?: StatusEnum;
}

export { ICreateFollowerDTO };
