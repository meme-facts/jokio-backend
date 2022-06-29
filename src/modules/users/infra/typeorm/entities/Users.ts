import { Post } from "@modules/posts/infra/typeorm/entities/Post";

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("users")
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  full_name: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  img_url: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  isPrivate: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany((type) => Post, (post) => post.user)
  post: Post[];

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
    if (!this.isPrivate) {
      this.isPrivate = false;
    }
  }
}

export { User };
