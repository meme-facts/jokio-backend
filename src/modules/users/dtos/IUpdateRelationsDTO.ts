import { StatusEnum } from "@shared/enums/StatusEnum";

interface IUpdateRelationDTO {
  requestedUserId: string;
  requesterUserId: string;
  fStatus: StatusEnum;
}

export { IUpdateRelationDTO };
