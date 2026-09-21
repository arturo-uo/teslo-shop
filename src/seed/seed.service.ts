import { Injectable } from '@nestjs/common'
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { Product } from './../products/entities';

@Injectable()
export class SeedService 
{
  constructor(
    private readonly productService: ProductsService
  )  {}

  async runSeed()
  {
    await this.insertNewProducts()
    return 'Seed executed'
  }  

  private async insertNewProducts()
  {
    await this.productService.deleteAllProducts()

    const products = initialData.products
    const insertPromises: Promise<any> [] = [] 
    products.forEach(p => {
      insertPromises.push(this.productService.create(p))
    })
    await Promise.all(insertPromises)
    return true
  }
}
