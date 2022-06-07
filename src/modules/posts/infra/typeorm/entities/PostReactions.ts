import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("postReactions")
class PostReaction {
  @PrimaryColumn()
  id: string;

  @Column()
  reactionType: string;

  @Column()
  userId: string;

  @Column()
  postId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { PostReaction };
