import { Injectable, InternalServerErrorException, BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { validate as isUUID } from 'uuid'

@Injectable()
export class ProductsService 
{

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto) 
  {
    try
    {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    }
    catch(error: Error | any)
    {
      this.handleDBExceptions(error)
    }
  }

  findAll(paginationDto: PaginationDto) 
  {
    const { limit, offset } = paginationDto;
    return this.productRepository.find({ take: limit, skip: offset });
  }

  async findOne(term: string) 
  {
    let product: Product | null;
    if(isUUID(term))
    {
      product = await this.productRepository.findOneBy({ id: term })
    }
    else
    {
      const queryBuilder = this.productRepository.createQueryBuilder('product')
      product = await queryBuilder
      .where('UPPER(title) =:title or slug =:slug', 
      {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).getOne()
    }
    if(!product)
      throw new NotFoundException(`Product with id or slug "${term}" not found`)
    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) 
  {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) 
  {
    const { affected } = await this.productRepository.delete(id);
    if (affected === 0) 
    {
      throw new BadRequestException(`Product with id "${id}" not found`);
    }
    return;
  }
  
  private handleDBExceptions(error: any): never
  {
    if(error.code === '23505')
    {
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}