import { Post } from 'src/posts/post.entity';
import { Image } from 'src/cloudinary/image.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
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

  @OneToOne(() => Image, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  image: Image;

  @OneToMany(() => Post, (post) => post.creator, { onDelete: 'SET NULL' })
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.likes, { onDelete: 'SET NULL' })
  liked: Post[];

  @ManyToMany(() => Post, (post) => post.saves, { onDelete: 'SET NULL' })
  saved: Post[];
}
