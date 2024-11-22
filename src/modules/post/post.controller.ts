import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../user/entites/user.entity';
import { skipAuth } from 'src/helpers/skipAuth';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Blog' })
  @ApiResponse({ status: 201, description: 'Blog created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('create-blog')
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.createPost(createPostDto, req.user);
  }
  
  @skipAuth()
  @ApiOperation({ summary: 'Get all Blog' })
  @ApiResponse({ status: 200, description: 'User Blog' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get()
  AllBlog() {
    return this.postService.AllBlog();
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a apecific blog' })
  @ApiResponse({ status: 200, description: 'Blog found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Blog Not Found' })
  @Get(':id')
  getSingleBlog(@Param('id') id: string, @Request() req) {
    return this.postService.getSingleBlog(id, req.user);
  }

  
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a apecific blog' })
  @ApiResponse({ status: 200, description: 'Blog updated' })
  @ApiResponse({ status: 401, description: 'Not Authorized' })
  @ApiResponse({ status: 404, description: 'Blog Not Found' })
  @Patch(':id')
  updateBlog(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req) {
    return this.postService.updateBlog(id, updatePostDto, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '  Delete a apecific blog' })
  @ApiResponse({ status: 200, description: 'Blog deleted' })
  @ApiResponse({ status: 401, description: 'Not Authorized' })
  @ApiResponse({ status: 404, description: 'Blog Not Found' })
  @Delete(':id')
  deleteBlog(@Param('id') id: string, @Request() req) {
    return this.postService.deleteBlog(id, req.user);
  }

}
