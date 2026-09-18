import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity()
export class ProductImage 
{
	@PrimaryGeneratedColumn()
	id: string

	@Column({ type: 'text'})
	url: string

	@ManyToOne(
		() => Product, 
		(product) => product.images, 
		{ onDelete: 'CASCADE' })
	product: Product
}