import { StatusEnum } from "@shared/enums/StatusEnum";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("followers")
class Follower {
  @PrimaryColumn()
  id: string;

  @Column()
  fStatus: string;

  @Column()
  requestedUserId: string;

  @Column()
  requesterUserId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
    if (!this.fStatus) {
      this.fStatus = StatusEnum.Accepted;
    }
  }
}

export { Follower };
