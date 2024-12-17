import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { skipAuth } from '../../helpers/skipAuth';
import { ErrorCreateUserResponse, SuccessCreateUserResponse, SuccessLoginResponse } from '../user/dto/user-response.dto';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
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
  @ApiResponse({ status: 200, description: 'Logged In successfully', type: SuccessLoginResponse })
  @ApiResponse({ status: 400, description: 'Invalid Credentials', type: ErrorCreateUserResponse })
  @Post('signin')
  signIn(@Body() Dto: LoginDto) {
    return this.authService.signIn(Dto);
  }

  @skipAuth()
  @ApiOperation({ summary: 'Confirm Email' })
  @ApiResponse({ status: 200, description: 'Email Confirmed successfully', type: SuccessLoginResponse })
  @ApiResponse({ status: 400, description: 'Invalid Credentials', type: ErrorCreateUserResponse })
  @Get('confirm-email')
  confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token)
  }

  @skipAuth()
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Logged In successfully', type: SuccessLoginResponse })
  @ApiResponse({ status: 400, description: 'Invalid Credentialsss', type: ErrorCreateUserResponse })
  @Post('forgotPassword')
  forgotPassword(@Body() dto: forgotPasswordDto) {
    return this.authService.forgotPassword(dto)
  }


  @skipAuth()
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({ status: 200, description: 'Logged In successfully', type: SuccessLoginResponse })
  @ApiResponse({ status: 400, description: 'Invalid Credentials', type: ErrorCreateUserResponse })
  @Post('reset-password')
  resetPassword(@Query('token') token: string, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(token, dto)
  }
}
