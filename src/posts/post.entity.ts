import { User } from 'src/users/user.entity';
import { Image } from 'src/cloudinary/image.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  caption: string;

  @Column({ type: 'simple-json' })
  tags: string[];

  @OneToOne(() => Image, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  image: Image;

  @Column()
  location: string;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  creator: User;

  @JoinTable()
  @ManyToMany(() => User, (user) => user.liked, { onDelete: 'SET NULL' })
  likes: User[];

  @JoinTable()
  @ManyToMany(() => User, (profile) => profile.saved, { onDelete: 'SET NULL' })
  saves: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
