import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards';
import { PostsService } from './posts.service';
import { CreatePostDTO, PaginatedPostsDTO, PostDTO } from './dtos';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users';
import { Serialize } from 'src/interceptors';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Serialize(PaginatedPostsDTO)
  @Get('/recent')
  getRecentPosts(
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.postsService.getRecent({ cursor, limit });
  }

  @Serialize(PaginatedPostsDTO)
  @Get('/saved')
  getSavedPosts(
    @CurrentUser() user: User,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.postsService.getSaved(user, { cursor, limit });
  }

  @Serialize(PostDTO)
  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Serialize(PostDTO)
  @Post('create')
  createPost(@CurrentUser() user: User, @Body() body: CreatePostDTO) {
    return this.postsService.create(body, user);
  }

  @Serialize(PostDTO)
  @Post('save/:id')
  savePost(@Param('id') id: number, @CurrentUser() user: User) {
    return this.postsService.save(id, user);
  }

  @Serialize(PostDTO)
  @Post('like/:id')
  likePost(@Param('id') id: number, @CurrentUser() user: User) {
    return this.postsService.like(id, user);
  }

  @Serialize(PostDTO)
  @Put(':id')
  updatePost(
    @Param('id') id: number,
    @Body() body: Partial<CreatePostDTO>,
    @CurrentUser() user: User,
  ) {
    return this.postsService.update(id, body, user);
  }

  @Serialize(PaginatedPostsDTO)
  @Get()
  searchPosts(
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.postsService.search(search, { cursor, limit });
  }

  @Delete('/:id')
  deletePost(@Param('id') id: number, @CurrentUser() user: User) {
    return this.postsService.remove(id, user);
  }
}
