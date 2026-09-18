import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';

@Entity()
export class Product 
{
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'text',	unique: true})
	title: string

	@Column('float', { default: 0	})
	price: number

	@Column({type: 'text', nullable: true})
	description: string

	@Column({type: 'text', unique: true})
	slug: string

	@Column({type:'int', default: 0	})
	stock: number

	@Column({type: 'text', array: true, default: []})
	sizes: string[]

	@Column({type: 'text'})
	gender: string

	@Column({type: 'text', array: true, default: []})
	tags: string[]

	@OneToMany(
		() => ProductImage, 
		(productImage) => productImage.product, 
		{ cascade: true, eager: true })
	images?: ProductImage[]

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
