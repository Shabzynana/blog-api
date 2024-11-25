import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { skipAuth } from '../../helpers/skipAuth';
import { ErrorCreateUserResponse, SuccessCreateUserResponse } from '../user/dto/user-response.dto';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @skipAuth()
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({ status: 201, description: 'Register a new user', type: SuccessCreateUserResponse })
  @ApiResponse({ status: 404, description: 'User already exists', type: ErrorCreateUserResponse })
  @Post('signup')
  signUp(@Body() Dto: CreateAuthDto) {
    return this.authService.signUp(Dto);
  }



  @skipAuth()
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Logged In successfully', type: SuccessCreateUserResponse })
  @ApiResponse({ status: 400, description: 'Invalid Credentials', type: ErrorCreateUserResponse })
  @Post('signin')
  signIn(@Body() Dto: LoginDto) {
    return this.authService.signIn(Dto);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
