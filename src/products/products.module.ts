import { TypeOrmModule } from 'node_modules/@nestjs/typeorm/dist/typeorm.module'
import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'

import { Product, ProductImage } from './entities'


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
  ],
})
export class ProductsModule {}
