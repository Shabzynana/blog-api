import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import appConfig from '../../config/auth.config';
import { IS_PUBLIC_KEY } from '../helpers/skipAuth';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublicRoute) {
      return true;
    }

    if (!token) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }

    const payload = await this.jwtService
      .verifyAsync(token, {
        secret: appConfig().jwtSecret,
      })
      .catch(err => null);

    if (!payload) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    if (this.isExpiredToken(payload)) {
      throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
    }
    request['user'] = payload;
    request['token'] = token;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isExpiredToken(token: any) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (token.exp < currentTime) {
      return true;
    }
    return false;
  }
}
