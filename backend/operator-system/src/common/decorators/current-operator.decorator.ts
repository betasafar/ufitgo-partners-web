// src/common/decorators/current-operator.decorator.ts
import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

export const CurrentOperator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user?.sub // Return the operator ID from JWT payload
})
