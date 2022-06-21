import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { Post } from "./Post";

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

  @ManyToOne((type) => Post)
  @JoinColumn({ name: "postId", referencedColumnName: "id" })
  post: Post;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { PostReaction };
