import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Post } from './post.entity';
import { CloudinaryModule } from 'src/cloudinary';
import { Image } from 'src/cloudinary/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Image]), CloudinaryModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
