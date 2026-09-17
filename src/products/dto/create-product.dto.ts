import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, isString, IsString, MinLength } from "class-validator"


export class CreateProductDto 
{
	@IsString()
	@MinLength(1)
	title: string

	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	slug?: string

	@IsOptional()
	@IsNumber()
	@IsPositive()	
	stock?: number

	@IsString({ each: true })
	@IsArray()
	sizes: string[]

	@IsIn(['men', 'women', 'kid', 'unisex'])
	gender: string

	@IsString({ each: true })
	@IsArray()
	tags: string[]
}
