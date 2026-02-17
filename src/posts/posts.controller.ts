import {
  Body,
  Controller,
  Delete,
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

  @Get('/recent')
  getRecentPosts() {
    return this.postsService.getRecent();
  }

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Post('create')
  createPost(@CurrentUser() user: User, @Body() body: CreatePostDTO) {
    return this.postsService.create(body, user);
  }

  @Post('save/:id')
  savePost(@Param('id') id: number, @CurrentUser() user: User) {
    return this.postsService.save(id, user);
  }

  @Post('like/:id')
  likePost(@Param('id') id: number, @CurrentUser() user: User) {
    return this.postsService.like(id, user);
  }

  @Put(':id')
  updatePost(
    @Param('id') id: number,
    @Body() body: Partial<CreatePostDTO>,
    @CurrentUser() user: User,
  ) {
    return this.postsService.update(id, body, user);
  }

  @Get('search/:search')
  searchPosts(@Param('search') search: string) {
    return this.postsService.find(search);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: number, @CurrentUser() user: User) {
    return this.postsService.remove(id, user);
  }
}
