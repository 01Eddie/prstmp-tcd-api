import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

export const GetUser = createParamDecorator(
  (data: keyof any | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Si se pasa una propiedad, devolver solo esa
    // Ejemplo: @GetUser('email') => user.email
    return data ? user?.[data] : user;
  },
);
