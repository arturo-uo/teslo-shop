import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' }) 
export class Product 
{
	@ApiProperty({
		example:'00000000-0000-0000-0000-000000000000',
		description:'Product ID',
		uniqueItems:true
	})
	@PrimaryGeneratedColumn('uuid')
	id: string

	@ApiProperty({
		example:'T-Shirt Teslo',
		description:'Product title',
		uniqueItems:true
	})
	@Column({ type: 'text',	unique: true})
	title: string

	@ApiProperty({
		example:10.99,
		description:'Product price'
	})
	@Column('float', { default: 0	})
	price: number

	@ApiProperty({
		example:'Green shirt',
		description:'Product description'
	})
	@Column({type: 'text', nullable: true})
	description: string

	@ApiProperty({
		example:'tshirt_teslo',
		description:'Product slug for seo routes',
		uniqueItems:true
	})
	@Column({type: 'text', unique: true})
	slug: string

	@ApiProperty({
		example:10,
		description:'Product strock',
		default:0
	})
	@Column({type:'int', default: 0	})
	stock: number

	@ApiProperty({
		example:['CH','M','G'],
		description:'Product sizes'
	})
	@Column({type: 'text', array: true, default: []})
	sizes: string[]

	@ApiProperty({
		example:'Woman',
		description:'Product gender'
	})
	@Column({type: 'text'})
	gender: string

	@ApiProperty({
		example:['Ropa de mujer', 'Playera'],
		description:'Product tags'
	})
	@Column({type: 'text', array: true, default: []})
	tags: string[]

	@ApiProperty()
	@OneToMany(
		() => ProductImage, 
		(productImage) => productImage.product, 
		{ cascade: true, eager: true })
	images?: ProductImage[]

	@ManyToOne(
		() => User,
		( user) => user.product,
		{ eager: true}
	)
	user:User

	@BeforeInsert()
	private checkSlugInsert() 
	{
		if (!this.slug) 
		{
			this.slug = this.title
		}
		this.slug = this.title
				.toLowerCase()
				.replaceAll(' ', '_')
				.replaceAll("'", '')
	}

	@BeforeUpdate()
	private checkSlugUpdate() 
	{
		this.slug = this.title
				.toLowerCase()
				.replaceAll(' ', '_')
				.replaceAll("'", '')
	}
}
