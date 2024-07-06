import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.error('No token found in the request headers');
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = this.configService.get<string>('SECRET');
      if (!secret) {
        console.error('JWT secret not found in configuration');
        throw new HttpException('Internal Server Error', 500);
      }

      const payload = await this.jwtService.verifyAsync(token, { secret });
      console.log('Token payload:', payload);  // Log payload to ensure it's correct
      request['user_data'] = payload;  // Correctly set user_data
      console.log('Request user_data set:', request['user_data']);
    } catch (error) {
      console.error('Error verifying token:', error.message);
      throw new HttpException({
        status: 419,
        message: 'Token expired',
      }, 419);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}