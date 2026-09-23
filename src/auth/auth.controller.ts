import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser, GetRawHeaders, RoleProtected, Auth } from './decorators'
import { User } from './entities/user.entity'
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interface/valid-roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') email: string,
    @GetRawHeaders() rawHeaders: string[]
  )
  {
    console.log(request)
    return {ok:true, message:"Allowed route", user, email, rawHeaders}
  }

  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute(@GetUser() user: User)
  {
    return {ok:true, message:"Allowed route", user}
  }

  @Get('private3')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute3(@GetUser() user: User)
  {
    return {ok:true, user}
  }

  @Get('private4')
  @Auth(ValidRoles.superUser)
  privateRoute4(@GetUser() user: User)
  {
    return {ok:true, user}
  }
}
