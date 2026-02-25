import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Image } from 'src/cloudinary/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Image]), CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
