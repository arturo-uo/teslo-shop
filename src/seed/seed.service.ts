import { Injectable } from '@nestjs/common'
import { ProductsService } from './../products/products.service'
import { initialData } from './data/seed-data'
import { Product } from './../products/entities'
import { User } from '../auth/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {
    await this.deleteTables()
    const adminUser = await this.insertUsers()
    await this.insertNewProducts(adminUser)
    return 'Seed executed'
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts()
    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder
      .delete()
      .from(User)
      .execute()
  }

  private async insertUsers() {
    const seedUsers = initialData.users
    const users: User[] = []
    seedUsers.forEach(user => {
      user.password = bcrypt.hashSync(user.password, 10)
      users.push(this.userRepository.create(user))
    })
    const dbUsers = await this.userRepository.save(seedUsers)
    return dbUsers[0]
  }

  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts()

    const products = initialData.products
    const insertPromises: Promise<any>[] = []
    products.forEach(p => {
      insertPromises.push(this.productService.create(p, user))
    })
    await Promise.all(insertPromises)
    return true
  }
}
