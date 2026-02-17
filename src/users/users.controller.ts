import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Serialize } from 'src/interceptors';
import { TopUsersDTO, UserDTO } from './dtos';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators';
import { AuthGuard } from 'src/guards';
import { User } from './user.entity';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Serialize(UserDTO)
  @Get('me')
  async me(@CurrentUser() currentUser: User) {
    const user = await this.usersService.findOne(currentUser?.id);

    if (!user) return null;

    return user;
  }

  @Serialize(TopUsersDTO)
  @Get('top/:limit')
  getTopUsers(@Param('limit') limit: number) {
    return this.usersService.getTopUsers(limit);
  }
}
