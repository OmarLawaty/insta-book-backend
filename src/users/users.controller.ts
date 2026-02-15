import { Controller, Get, UseGuards } from '@nestjs/common';

import { Serialize } from 'src/interceptors';
import { UserDTO } from './dtos';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators';
import { AuthGuard } from 'src/guards';
import { User } from './user.entity';

@Serialize(UserDTO)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() currentUser: User) {
    const user = this.usersService.findOne(currentUser.id);

    if (!user) return null;

    return user;
  }
}
