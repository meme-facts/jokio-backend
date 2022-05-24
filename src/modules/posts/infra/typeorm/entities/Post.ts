import { User } from "@modules/users/infra/typeorm/entities/Users";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
      this.isActive = true
    }
  }
}

export { Post };
