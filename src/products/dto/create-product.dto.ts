import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, isString, IsString, MinLength } from "class-validator"


export class CreateProductDto 
{
	@ApiProperty({
		description:'Product title (unique)',
		nullable:false,
		minLength:1
	})
	@IsString()
	@MinLength(1)
	title: string

	@ApiProperty({
		description:'Product price',
		nullable:true
	})
	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number

	@ApiProperty({
		description:'Product description'})
	@IsOptional()
	@IsString()
	description?: string

	@ApiProperty({
		description:'Product slug'})
	@IsOptional()
	@IsString()
	slug?: string

	@ApiProperty({
		description:'Product stock'})
	@IsOptional()
	@IsNumber()
	@IsPositive()	
	stock?: number

	@ApiProperty({
		description:'Product sizes'})
	@IsString({ each: true })
	@IsArray()
	sizes: string[]

	@ApiProperty({
		description:'Product gender'})
	@IsIn(['men', 'women', 'kid', 'unisex'])
	gender: string

	@ApiProperty({
		description:'Product tags'})
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	tags: string[]

	@ApiProperty({
		description:'Product images'})
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	images?: string[]
}
