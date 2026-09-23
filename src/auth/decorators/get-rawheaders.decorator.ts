import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetRawHeaders = createParamDecorator(
	(data:string, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest()
		const headers = req.rawHeaders
		if (!headers)
			throw new InternalServerErrorException('User not found')
		return headers
	}
)