import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { User } from "./Users";

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

  @ManyToOne((type) => User)
  @JoinColumn({ name: "requestedUserId", referencedColumnName: "id" })
  followers: User;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "requesterUserId", referencedColumnName: "id" })
  following: User;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
    if (!this.fStatus) {
      this.fStatus = FollowerStatusEnum.Accepted;
    }
  }
}

export { Follower };
