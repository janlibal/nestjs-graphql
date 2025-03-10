import { Injectable } from '@nestjs/common'
import {
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { CustomGraphQLError } from 'src/filters/custom.error'

@Injectable()
export class GqlAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context)
    const ctx = gqlContext.getContext().req

    if (!ctx) {
      throw new UnauthorizedException('No gqlContext!')
    }

    const authorization = ctx.headers.authorization

    if (!authorization) {
      throw new CustomGraphQLError('No authorization!', 'UNAUTHORIZED')
      //throw new UnauthorizedException('No authorization!')
    }

    if (
      !authorization ||
      Array.isArray(authorization) ||
      typeof authorization !== 'string'
    )
      throw new UnauthorizedException('Invalid headers!')

    const [jwt, accessToken] = authorization.split(' ')

    if (jwt !== 'jwt') throw new UnauthorizedException('No jwt!')

    const token = authorization.split(' ')[1] // The headers are attached to the request

    if (!token) {
      throw new UnauthorizedException('No token provided')
    }

    const user = true // await this.authService.verifyToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    // Attach the user to the request context for later use
    ctx.user = user

    return true
  }
}

/*@Injectable()
export class GqlAuthGuard implements CanActivate {
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();  // Switch to HTTP context, for getting headers
    const request = ctx.getRequest();    // Get the request object from context
    
    const token = request.headers.authorization?.split(' ')[1];  // Extract token from 'Authorization' header
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    // Pass the token to your AuthService for verification
    const user = true //await this.authService.verifyToken(token);
    
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Attach the user to the request object for later access in resolvers
    request.user = user;

    return true;  // Proceed with the request
  }
}*/
