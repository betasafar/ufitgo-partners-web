// src/common/decorators/current-operator.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentOperator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // assuming your JWT guard sets req.user = { id: ... }
  },
);