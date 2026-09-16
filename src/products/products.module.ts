import { TypeOrmModule } from 'node_modules/@nestjs/typeorm/dist/typeorm.module'
import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'

import { Product } from './entities/product.entity'


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product]),
  ],
})
export class ProductsModule {}
