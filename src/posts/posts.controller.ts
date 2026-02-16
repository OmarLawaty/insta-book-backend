import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards';
import { PostsService } from './posts.service';
import { CreatePostDTO, PostDTO } from './dtos';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users';
import { Serialize } from 'src/interceptors';

@Serialize(PostDTO)
@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Post('create')
  createPost(@CurrentUser() user: User, @Body() body: CreatePostDTO) {
    return this.postsService.create(body, user);
  }

  @Put(':id')
  updatePost(@Param('id') id: number, @Body() body: Partial<CreatePostDTO>) {
    return this.postsService.update(id, body);
  }

  @Get('search/:search')
  searchPosts(@Param('search') search: string) {
    return this.postsService.find(search);
  }

  @Get('delete/:id')
  deletePost(@Param('id') id: number) {
    return this.postsService.remove(id);
  }
}
