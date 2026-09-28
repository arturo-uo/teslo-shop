import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto 
{
	@ApiProperty({default:10,
		description:'How many rows do you need?',
		required:false
	})
	@IsOptional()
	@IsNumber()
	@IsPositive()
	@Type(() => Number)
	limit?: number
	
	@ApiProperty({default:0,
		description:'How many rows do you want to skip?',
		required:false
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	@Min(0)
	offset?: number
}