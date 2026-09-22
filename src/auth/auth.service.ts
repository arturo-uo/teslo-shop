import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto
      const user = this.userRepository.create({
        ...userData, 
        password: bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user)
      //delete user['password']
      //return user

      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    catch (error: Error | any) {
      this.handleDBExceptions(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto
    const user = await this.userRepository.findOne({
      where: {email},
      select: {email:true, password:true}
    })
    if(!user)
      throw new UnauthorizedException('No valid email')

    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('No valid password')

    return user
    // try {
      
    // }
    // catch (error: Error | any) {
    //   this.handleDBExceptions(error)
    // }
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    this.logger.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
