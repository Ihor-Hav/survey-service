import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      console.log('RTGuard error:', err);
      console.log('RTGuard user:', user);
      console.log('RTGuard info:', info);
      throw err || new Error('Refresh token invalid');
    }

    return user;
  }
}
