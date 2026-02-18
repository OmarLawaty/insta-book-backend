import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  extractToken(req: any): string | null {
    const cookieToken = this.extractFromCookies(req);
    if (cookieToken) return cookieToken;

    return this.extractFromAuthHeader(req);
  }

  async verifyAndLoadUser(token: string): Promise<User | null> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    return this.usersService.findOne(payload.sub);
  }

  private extractFromCookies(req: any): string | null {
    const parsed = req.cookies?.access_token;
    if (parsed) return parsed;

    const cookieHeader = req.headers?.cookie as string | undefined;
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';').map((c: string) => c.trim());
    for (const pair of cookies) {
      if (!pair) continue;
      const [name, ...rest] = pair.split('=');
      if (name === 'access_token') return rest.join('=');
    }

    return null;
  }

  private extractFromAuthHeader(req: any): string | null {
    const authHeader = req.headers?.authorization as string | undefined;
    if (!authHeader) return null;

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;

    return token;
  }
}
