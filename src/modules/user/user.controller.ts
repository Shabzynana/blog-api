import { Controller, Get, Post, Req } from "@nestjs/common";
import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    StreamableFile,
  } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from "./user.service";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}


    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Current User information' })
    @ApiResponse({ status: 200, description: 'Current User'})
    @ApiResponse({ status: 401, description: 'No token provided' })
    @ApiResponse({ status: 403, description: 'Invalid token' })
    @ApiResponse({ status: 401, description: 'Token expired' })
    @Get('currentUser')
    async currentUser(@Req() request: Request) {
        const user = request['user'];
        const userId = user.id;

        return this.userService.currentUser(userId)
    }


    @Post('signin')
    signin() {
        return this.userService.signin()
    }

}