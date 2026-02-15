import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  caption: string;

  @Column({ type: 'simple-json' })
  tags: string[];

  @Column()
  imageUrl: string;

  @Column()
  imageId: string;

  @Column()
  location: string;

  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @ManyToMany(() => User, (user) => user.liked)
  likes: User[];

  @ManyToMany(() => User, (profile) => profile.saved)
  saves: User[];
}
