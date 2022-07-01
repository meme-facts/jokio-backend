import { User } from "@modules/users/infra/typeorm/entities/Users";
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
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

  likesCount: number;

  dislikeCount: number;

  @AfterLoad()
  async countLikes() {
    const { count } = await getRepository(PostReaction)
      .createQueryBuilder("reaction")
      .where("reaction.postId = :id and reaction.reactionType = 'L' ", {
        id: this.id,
      })
      .select("COUNT(*)", "count")
      .getRawOne();

    this.likesCount = count;
  }
  @AfterLoad()
  async countDislikesLikes() {
    const { count } = await getRepository(PostReaction)
      .createQueryBuilder("reaction")
      .where("reaction.postId = :id and reaction.reactionType = 'D' ", {
        id: this.id,
      })
      .select("COUNT(*)", "count")
      .getRawOne();

    this.dislikeCount = count;
  }
  constructor() {
    if (!this.id) {
      this.id = uuidV4();
      this.isActive = true;
    }
  }
}

export { Post };
