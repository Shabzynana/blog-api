import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { skipAuth } from 'src/helpers/skipAuth';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add comment to a blog' })
  @ApiResponse({ status: 200, description: 'comment added' })
  @ApiResponse({ status: 401, description: 'Not Authorized' })
  @ApiResponse({ status: 404, description: 'Blog Not Found' })
  @Post(':id/comments')
  create(@Param('id') postId: string, @Body() createCommentDto: CreateCommentDto, @Request() req)  {
    return this.commentService.addComment(postId, createCommentDto, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all comment of a blog' })
  @ApiResponse({ status: 200, description: 'User comment' })
  @ApiResponse({ status: 401, description: 'Not Authorized' })
  @ApiResponse({ status: 404, description: 'Blog Not Found' })
  @Get(':id/comments')
  findAllComment(@Param('id') postId: string, @Request() req) {
    return this.commentService.findAllComment(postId, req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all comment of a blog' })
  @ApiResponse({ status: 200, description: 'User comment' })
  @ApiResponse({ status: 401, description: 'Not Authorized' })
  @ApiResponse({ status: 404, description: 'comment Not Found' })
  @Get(':id/single-comment')
  getSingleComment(@Param('id') id: string, @Request() req) {
    return this.commentService.getSingleComment(id, req.user);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentService.update(+id, updateCommentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.commentService.remove(+id);
  // }
}
