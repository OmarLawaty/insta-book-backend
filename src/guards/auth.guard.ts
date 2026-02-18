import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthTokenService } from 'src/auth/auth-token.service';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authTokenService: AuthTokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();
    const token = this.authTokenService.extractToken(req);

    // For public routes, attempt to hydrate currentUser if a token is present, but do not block.
    if (isPublic) {
      if (token)
        req.currentUser = await this.authTokenService
          .verifyAndLoadUser(token)
          .catch(() => null);

      return true;
    }

    if (!token) throw new UnauthorizedException('Missing token');

    try {
      const user = await this.authTokenService.verifyAndLoadUser(token);
      if (!user) throw new UnauthorizedException('User not found');

      req.currentUser = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
