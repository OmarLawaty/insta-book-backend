import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Serialize } from 'src/interceptors';
import {
  FullUserDTO,
  PaginatedUsersDTO,
  PartialUserDTO,
  TopUsersDTO,
  UpdateUserDTO,
} from './dtos';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators';
import { AuthGuard } from 'src/guards';
import { User } from './user.entity';
import { Public } from 'src/auth/decorators';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Serialize(FullUserDTO)
  @Get('me/full')
  async meFull(@CurrentUser() currentUser: User) {
    const user = await this.usersService.getUser(currentUser?.id);

    if (!user) return null;

    return user;
  }

  @Serialize(PartialUserDTO)
  @Get('me')
  async me(@CurrentUser() currentUser: User) {
    const user = await this.usersService.findOne(currentUser?.id);

    if (!user) return null;

    return user;
  }

  @Serialize(FullUserDTO)
  @Put('me')
  updateUser(@Body() body: Partial<UpdateUserDTO>, @CurrentUser() user: User) {
    return this.usersService.updateUser(user.id, body);
  }

  @Public()
  @Serialize(TopUsersDTO)
  @Get('top/:limit')
  getTopUsers(@Param('limit') limit: number) {
    return this.usersService.getTopUsers(limit);
  }

  @Public()
  @Serialize(FullUserDTO)
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.usersService.getUser(id);
  }

  @Public()
  @Serialize(PaginatedUsersDTO)
  @Get()
  searchUsers(
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.search(search, { cursor, limit });
  }
}
