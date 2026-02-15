import { Post } from 'src/posts/post.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthday: string;

  @Column({ default: '' })
  bio: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  imageId: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.likes)
  liked: Post[];

  @ManyToMany(() => Post, (post) => post.saves)
  saved: Post[];
}
