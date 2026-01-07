import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

export const CurrentOperator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  // Extract operator from JWT payload attached by AuthGuard
  // The JWT strategy should attach the operator to request.user
  return request.user
})
