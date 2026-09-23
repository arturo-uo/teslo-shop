import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { User } from "../entities/user.entity"
import { JwtPayload } from "../interface/jwt-payload.interface"
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { privateDecrypt } from "crypto"
import { Repository } from "typeorm"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		configService:ConfigService){
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET')
		})
	}

	async validate(payload: JwtPayload): Promise<User>
	{
		const { email } = payload
		const user = await this.userRepository.findOneBy({email})
		if(!user)
			throw new UnauthorizedException('Token not valid')

		if(!user.isActive)
			throw new UnauthorizedException('User is inactive, talk with system admin')

		return user
	}
}