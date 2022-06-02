import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("comments")
class Comments {
  @PrimaryColumn()
  id: string;

  @Column()
  message: string;

  @Column()
  userId: string;

  @Column()
  postId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { Comments };
