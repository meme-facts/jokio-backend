import { User } from "@modules/users/infra/typeorm/entities/Users";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { PostReaction } from "./PostReactions";

@Entity("posts")
class Post {
  @PrimaryColumn()
  id: string;

  @Column()
  postDescription: string;

  @Column()
  img_url?: string;

  @Column()
  isActive: boolean;

  @Column()
  user_id: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @OneToMany((type) => PostReaction, (postReaction) => postReaction.post)
  postReaction: PostReaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
      this.isActive = true;
    }
  }
}

export { Post };
