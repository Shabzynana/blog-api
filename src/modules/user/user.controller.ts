import { Controller, Delete, Get, Param, Post, Req, Request, Logger } from "@nestjs/common";
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


    @ApiBearerAuth()
    @ApiOperation({ summary: 'All User Blog' })
    @ApiResponse({ status: 200, description: 'Blogs retrieved' })
    @ApiResponse({ status: 401, description: 'No token provided' })
    @ApiResponse({ status: 403, description: 'Invalid token' })
    @Get(':id/user-blog')
    allUserBlog(@Param('id') id: string) {
        return this.userService.allUserBlog(id)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Follow Users' })
    @ApiResponse({ status: 200, description: 'Bussss' })
    @ApiResponse({ status: 401, description: 'No token provided' })
    @ApiResponse({ status: 403, description: 'Invalid token' })
    @Post(':id/follow')
    async followUser(@Param('id') id: string, @Request() req) {
        return this.userService.followUser(id, req.user)
    }

    
    @ApiBearerAuth()
    @ApiOperation({ summary: 'unFollow Users' })
    @ApiResponse({ status: 200, description: 'Blogs retrieved' })
    @ApiResponse({ status: 401, description: 'No token provided' })
    @ApiResponse({ status: 403, description: 'Invalid token' })
    @Post(':id/unfollow')
    async unfollowUser(@Param('id') id: string, @Request() req) {  
        return this.userService.unfollowUser(id, req.user)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Users Following'})
    @ApiResponse({ status: 200, description: 'Following retrieved' })
    @ApiResponse({ status: 401, description: 'No token provided' })
    @ApiResponse({ status: 403, description: 'Invalid token' })
    @Get(':id/following')
    async getFollowing(@Param('id') id: string) {
        return this.userService.getFollowing(id)
    }


    @ApiBearerAuth()
    @ApiOperation({ summary: 'Users Following'})
    @ApiResponse({ status: 200, description: 'Following retrieved' })
    @ApiResponse({ status: 401, description: 'No token provided' })
    @ApiResponse({ status: 403, description: 'Invalid token' })
    @Get(':id/followers')
    async getFollowers(@Param('id') id: string) {
        return this.userService.getFollowers(id)
    }



    @ApiBearerAuth()
    @ApiOperation({ summary: 'Soft delete a user account' })
    @ApiResponse({ status: 204, description: 'Deletion in progress' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @Delete(':id')
    async softDeleteUser(@Param('id') id: string, @Request() req) {
        Logger.log(id, 'user id')
        Logger.log(req.user.id, 'current user id')
        return this.userService.softDeleteUser(id, req.user)
    }

}